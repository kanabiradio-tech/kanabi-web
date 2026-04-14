/**
 * schedule_week.ts — 批次排程一週的小說章節
 *
 * 掃描 novels/ 資料夾中尚未上傳的章節，
 * 按照每日雙線排程自動分配 published_at 日期，
 * 上傳到 Supabase。網站只會在到期日才顯示。
 *
 * 用法：
 *   npx tsx scripts/schedule_week.ts                  # 從下一個排程日開始
 *   npx tsx scripts/schedule_week.ts 2026-04-14       # 從指定日期開始
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const supabase = createClient(
  'https://jqsqhraulzbvblxrbqsi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FocmF1bHpidmJseHJicXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIwOTYsImV4cCI6MjA5MDQxODA5Nn0.bSXEldbQUNBcZKHSVLt8Z1JX9IPeVYAO8Wb3R_4erLw'
)

const NOVELS_DIR = '/Volumes/Macdate3/Dropbox/kanabi-darkverse/novels'

// 系列對應（跟 publish_missing.ts 一致）
const seriesMap: Record<string, { series: string; voice: string }> = {
  '01_斬斷星辰':         { series: '斬斷星辰',         voice: '林宗佑' },
  '02_台北冥影':         { series: '台北冥影',         voice: '簡瑞麒' },
  '03_許願便利商店':     { series: '許願便利商店',     voice: '陸沉淵' },
  // '04_守夜人':        { series: '守夜人',           voice: '陸沉淵' },  // 暫停
  '05_我直播的不是靈異': { series: '我直播的不是靈異', voice: '簡瑞麒' },
  '燼光_CINERIS':        { series: '燼光 CINERIS',    voice: '陸沉淵' },
  '06_鯤島淵界':         { series: '鯤島淵界',        voice: '陸沉淵' },
}

// 每日雙線排程（0=週一 ... 6=週日）
// 週日 (6) 不排
const WEEKLY_SCHEDULE: Record<number, string[]> = {
  0: ['燼光 CINERIS', '斬斷星辰'],       // 週一
  1: ['許願便利商店', '台北冥影'],         // 週二
  2: ['鯤島淵界', '我直播的不是靈異'],     // 週三
  3: ['燼光 CINERIS', '斬斷星辰'],       // 週四
  4: ['許願便利商店', '台北冥影'],         // 週五
  5: ['鯤島淵界', '我直播的不是靈異'],     // 週六
  // 6: 週日休刊
}

function getDayOfWeek(date: Date): number {
  // JS getDay: 0=Sun, 1=Mon ... 6=Sat → convert to 0=Mon ... 6=Sun
  const d = date.getDay()
  return d === 0 ? 6 : d - 1
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toPublishTime(date: Date): string {
  // 每天早上 05:00 台北時間 (UTC+8) = 前一天 21:00 UTC
  const d = new Date(date)
  d.setHours(5, 0, 0, 0)
  return d.toISOString()
}

function extractTitle(raw: string, fallback: string): string {
  for (const line of raw.split('\n')) {
    const match = line.match(/^#\s+(?:S\d+E\d+\s*[　\s]*)?\s*(.+)/)
    if (match) return match[1].trim()
  }
  return fallback
}

function countWords(raw: string): number {
  return (raw.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
}

async function main() {
  // Parse start date from args, or use today
  const startArg = process.argv[2]
  let startDate: Date
  if (startArg) {
    startDate = new Date(startArg + 'T00:00:00+08:00')
    if (isNaN(startDate.getTime())) {
      console.error(`無效日期: ${startArg}，格式: YYYY-MM-DD`)
      process.exit(1)
    }
  } else {
    startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
  }

  console.log(`排程起始日: ${startDate.toLocaleDateString('zh-TW')}\n`)

  // 1. Fetch existing episodes
  const { data: existing, error: fetchError } = await supabase
    .from('posts')
    .select('series, episode')

  if (fetchError) {
    console.error('無法讀取 Supabase:', fetchError.message)
    process.exit(1)
  }

  const existingSet = new Set(
    (existing || []).map((p) => `${p.series}||${p.episode}`)
  )

  console.log(`Supabase 目前有 ${existingSet.size} 篇文章`)

  // 2. Find unpublished chapters per series
  const unpublished: Record<string, { episode: string; title: string; content: string; wordCount: number; voice: string }[]> = {}

  for (const [folder, meta] of Object.entries(seriesMap)) {
    const s01Dir = resolve(NOVELS_DIR, folder, 'S01')
    if (!existsSync(s01Dir)) continue

    const files = readdirSync(s01Dir)
      .filter((f: string) => /^E\d+\.md$/.test(f))
      .sort()

    for (const file of files) {
      const ep = file.replace('.md', '')
      const episodeCode = `S01${ep}`
      const key = `${meta.series}||${episodeCode}`

      if (existingSet.has(key)) continue

      const raw = readFileSync(resolve(s01Dir, file), 'utf-8')
      const title = extractTitle(raw, `${meta.series} ${episodeCode}`)
      const wordCount = countWords(raw)

      if (!unpublished[meta.series]) unpublished[meta.series] = []
      unpublished[meta.series].push({
        episode: episodeCode,
        title,
        content: raw,
        wordCount,
        voice: meta.voice,
      })
    }
  }

  const totalNew = Object.values(unpublished).reduce((sum, arr) => sum + arr.length, 0)
  if (totalNew === 0) {
    console.log('\n沒有新章節需要排程。')
    return
  }

  console.log(`\n找到 ${totalNew} 篇新章節：`)
  for (const [series, chapters] of Object.entries(unpublished)) {
    console.log(`  ${series}: ${chapters.map(c => c.episode).join(', ')}`)
  }

  // 3. Assign dates based on schedule
  const rows: any[] = []
  const seriesQueues = { ...unpublished } // copy pointers

  let currentDate = new Date(startDate)
  let scheduled = 0

  // Schedule up to 14 days ahead (two weeks max per run)
  for (let dayOffset = 0; dayOffset < 14 && scheduled < totalNew; dayOffset++) {
    const date = addDays(startDate, dayOffset)
    const dow = getDayOfWeek(date)

    const todaySeries = WEEKLY_SCHEDULE[dow]
    if (!todaySeries) continue // Sunday

    for (const seriesName of todaySeries) {
      const queue = seriesQueues[seriesName]
      if (!queue || queue.length === 0) continue

      const chapter = queue.shift()!
      rows.push({
        title: chapter.title,
        content: chapter.content,
        series: seriesName,
        episode: chapter.episode,
        voice: chapter.voice,
        word_count: chapter.wordCount,
        status: 'published',
        published_at: toPublishTime(date),
      })
      scheduled++

      const dateStr = date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' })
      console.log(`\n  📅 ${dateStr} → [${seriesName}] ${chapter.episode} — ${chapter.title}`)
    }
  }

  if (rows.length === 0) {
    console.log('\n排程結果為空。')
    return
  }

  console.log(`\n\n共 ${rows.length} 篇排程，開始上傳...\n`)

  // 4. Insert
  for (let i = 0; i < rows.length; i += 5) {
    const batch = rows.slice(i, i + 5)
    const { data, error } = await supabase
      .from('posts')
      .insert(batch)
      .select('id, series, episode, title, published_at')

    if (error) {
      console.error(`批次 ${Math.floor(i / 5) + 1} 匯入失敗:`, error.message)
      continue
    }

    for (const row of data) {
      const pubDate = new Date(row.published_at).toLocaleDateString('zh-TW')
      console.log(`  ✅ ${pubDate} [${row.series}] ${row.episode} — ${row.title}`)
    }
  }

  console.log('\n排程完成！文章會在指定日期 05:00 自動出現在網站上。')
}

main()
