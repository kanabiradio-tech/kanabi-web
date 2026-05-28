import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const supabase = createClient(
  'https://jqsqhraulzbvblxrbqsi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FocmF1bHpidmJseHJicXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIwOTYsImV4cCI6MjA5MDQxODA5Nn0.bSXEldbQUNBcZKHSVLt8Z1JX9IPeVYAO8Wb3R_4erLw'
)

const NOVELS_DIR = '/Volumes/Dbox_Data/Dropbox/kanabi-darkverse/novels'

const seriesMap: Record<string, { series: string; voice: string }> = {
  '01_斬斷星辰':         { series: '斬斷星辰',         voice: '林宗佑' },
  '02_台北冥影':         { series: '台北冥影',         voice: '簡瑞麒' },
  '03_許願便利商店':     { series: '許願便利商店',     voice: '陸沉淵' },
  // '04_守夜人':           { series: '守夜人',           voice: '陸沉淵' },  // 暫停，下一季再開
  '05_我直播的不是靈異': { series: '我直播的不是靈異', voice: '簡瑞麒' },
  '燼光_CINERIS':        { series: '燼光 CINERIS',    voice: '陸沉淵' },
  '06_鯤島淵界':         { series: '鯤島淵界',        voice: '陸沉淵' },
}

function extractTitle(raw: string, fallback: string): string {
  const lines = raw.split('\n')

  for (const line of lines) {
    const match = line.match(/^##\s+(?:第[一二三四五六七八九十百千零〇兩]+章[　\s]*)?(.+)/)
    if (match) {
      return match[1].trim()
    }
  }

  for (const line of lines) {
    const match = line.match(/^#\s+(?:S\d+E\d+\s*[　\s]*)?\s*(.+)/)
    if (match) {
      return match[1].trim()
    }
  }

  return fallback
}

async function main() {
  // 1. Fetch all existing episodes from Supabase
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

  console.log(`Supabase 目前有 ${existingSet.size} 篇文章\n`)

  // 2. Scan local files, find missing ones
  const rows: any[] = []

  for (const [folder, meta] of Object.entries(seriesMap)) {
    const s01Dir = resolve(NOVELS_DIR, folder, 'S01')
    if (!existsSync(s01Dir)) continue

    // Find all E*.md files
    const files = require('fs')
      .readdirSync(s01Dir)
      .filter((f: string) => /^E\d+\.md$/.test(f))
      .sort()

    for (const file of files) {
      const ep = file.replace('.md', '')
      const episodeCode = `S01${ep}`
      const key = `${meta.series}||${episodeCode}`

      if (existingSet.has(key)) {
        continue // already published
      }

      const filePath = resolve(s01Dir, file)
      const raw = readFileSync(filePath, 'utf-8')

      const title = extractTitle(raw, `${meta.series} ${episodeCode}`)

      const wordCount = (raw.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length

      rows.push({
        title,
        content: raw,
        series: meta.series,
        episode: episodeCode,
        voice: meta.voice,
        word_count: wordCount,
        status: 'published',
        published_at: new Date().toISOString(),
      })

      console.log(`  待發布: [${meta.series}] ${episodeCode} — ${title} (${wordCount} 字)`)
    }
  }

  if (rows.length === 0) {
    console.log('\n所有章節都已發布，沒有新內容。')
    return
  }

  console.log(`\n共 ${rows.length} 篇待發布，開始上傳...\n`)

  // 3. Insert in batches of 5
  for (let i = 0; i < rows.length; i += 5) {
    const batch = rows.slice(i, i + 5)
    const { data, error } = await supabase.from('posts').insert(batch).select('id, series, episode, title, word_count')

    if (error) {
      console.error(`批次 ${i / 5 + 1} 匯入失敗:`, error.message)
      continue
    }

    for (const row of data) {
      console.log(`  ✅ [${row.series}] ${row.episode} — ${row.title} (${row.word_count} 字)`)
    }
  }

  console.log('\n發布完成！')
}

main()
