import { createClient } from '@supabase/supabase-js'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const supabase = createClient(
  'https://jqsqhraulzbvblxrbqsi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FocmF1bHpidmJseHJicXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIwOTYsImV4cCI6MjA5MDQxODA5Nn0.bSXEldbQUNBcZKHSVLt8Z1JX9IPeVYAO8Wb3R_4erLw'
)

const DRAFTS_DIR = '/Volumes/Dbox_Data/Dropbox/kanabi-darkverse/output/drafts'

type NewsMeta = {
  series: string
  voice: string
  episodePrefix: string
}

type PostInsert = {
  title: string
  content: string
  series: string
  episode: string
  voice: string
  word_count: number
  status: 'published'
  published_at: string
}

function metaForType(type: string): NewsMeta | null {
  if (type.includes('萬年視角') || type.includes('每日新聞')) {
    return { series: '每日新聞', voice: '陸沉淵', episodePrefix: 'NEWS' }
  }
  if (type.includes('荒唐新聞')) {
    return { series: '荒唐新聞', voice: '林宗佑', episodePrefix: 'ODD' }
  }
  return null
}

function extractTitle(raw: string, fallback: string): string {
  for (const line of raw.split('\n')) {
    const match = line.match(/^#\s+(.+)/)
    if (match) return match[1].trim()
  }
  return fallback
}

function wordCount(raw: string): number {
  return (raw.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
}

async function main() {
  if (!existsSync(DRAFTS_DIR)) {
    console.log(`找不到每日新聞草稿資料夾：${DRAFTS_DIR}`)
    return
  }

  const { data: existing, error: fetchError } = await supabase
    .from('posts')
    .select('series, episode')

  if (fetchError) {
    console.error('無法讀取 Supabase:', fetchError.message)
    process.exit(1)
  }

  const existingSet = new Set((existing || []).map((p) => `${p.series}||${p.episode}`))
  console.log(`Supabase 目前有 ${existingSet.size} 篇文章\n`)

  const rows: PostInsert[] = []
  const files = readdirSync(DRAFTS_DIR)
    .filter((file) => /^\d{8}_.+_文字版\.md$/.test(file))
    .sort()

  for (const file of files) {
    const match = file.match(/^(\d{8})_(.+)_文字版\.md$/)
    if (!match) continue

    const [, date, type] = match
    const meta = metaForType(type)
    if (!meta) continue

    const episode = `${meta.episodePrefix}-${date}`
    const key = `${meta.series}||${episode}`
    if (existingSet.has(key)) continue

    const raw = readFileSync(resolve(DRAFTS_DIR, file), 'utf-8')
    const title = extractTitle(raw, `${meta.series} ${date}`)
    const count = wordCount(raw)

    rows.push({
      title,
      content: raw,
      series: meta.series,
      episode,
      voice: meta.voice,
      word_count: count,
      status: 'published',
      published_at: new Date().toISOString(),
    })

    console.log(`  待發布: [${meta.series}] ${episode} — ${title} (${count} 字)`)
  }

  if (rows.length === 0) {
    console.log('\n所有每日新聞都已發布，沒有新內容。')
    return
  }

  console.log(`\n共 ${rows.length} 篇待發布，開始上傳...\n`)

  const { data, error } = await supabase
    .from('posts')
    .insert(rows)
    .select('id, series, episode, title, word_count')

  if (error) {
    console.error('每日新聞發布失敗:', error.message)
    process.exit(1)
  }

  for (const row of data || []) {
    console.log(`  ✅ [${row.series}] ${row.episode} — ${row.title} (${row.word_count} 字)`)
  }

  console.log('\n發布完成！')
}

main()
