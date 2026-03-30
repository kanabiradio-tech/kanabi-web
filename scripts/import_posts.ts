import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const supabase = createClient(
  'https://jqsqhraulzbvblxrbqsi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FocmF1bHpidmJseHJicXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIwOTYsImV4cCI6MjA5MDQxODA5Nn0.bSXEldbQUNBcZKHSVLt8Z1JX9IPeVYAO8Wb3R_4erLw'
)

const NOVELS_DIR = '/Volumes/Macdate3/Dropbox/kanabi-darkverse/novels'

const seriesMap: Record<string, { series: string; voice: string }> = {
  '01_斬斷星辰':       { series: '斬斷星辰',       voice: '林宗佑' },
  '02_台北冥影':       { series: '台北冥影',       voice: '簡瑞麒' },
  '03_許願便利商店':   { series: '許願便利商店',   voice: '陸沉淵' },
  '04_燼光':           { series: '燼光',           voice: '陸沉淵' },
  '05_我直播的不是靈異': { series: '我直播的不是靈異', voice: '簡瑞麒' },
}

const episodes = ['E01', 'E02']

async function main() {
  const rows: any[] = []

  for (const [folder, meta] of Object.entries(seriesMap)) {
    for (const ep of episodes) {
      const filePath = resolve(NOVELS_DIR, folder, 'S01', `${ep}.md`)
      const raw = readFileSync(filePath, 'utf-8')

      // First line is the title (strip leading #)
      const lines = raw.split('\n')
      const title = lines[0].replace(/^#\s*/, '').trim()
      const content = raw

      // Count Chinese characters + other non-space characters as word count
      const wordCount = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length

      rows.push({
        title,
        content,
        series: meta.series,
        episode: `S01${ep}`,
        voice: meta.voice,
        word_count: wordCount,
        status: 'published',
        published_at: '2026-03-29T00:00:00+08:00',
      })
    }
  }

  const { data, error } = await supabase.from('posts').insert(rows).select()

  if (error) {
    console.error('匯入失敗:', error.message)
    process.exit(1)
  }

  console.log(`匯入成功！共 ${data.length} 筆資料`)
  for (const row of data) {
    console.log(`  - [${row.series}] ${row.episode} — ${row.title} (${row.word_count} 字)`)
  }
}

main()
