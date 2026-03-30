import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jqsqhraulzbvblxrbqsi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FocmF1bHpidmJseHJicXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIwOTYsImV4cCI6MjA5MDQxODA5Nn0.bSXEldbQUNBcZKHSVLt8Z1JX9IPeVYAO8Wb3R_4erLw'
)

function cleanTitle(title: string): string {
  return title
    .replace(/^#\s*/, '')           // remove leading #
    .replace(/^S\d+E\d+\s*/, '')    // remove S01E01 prefix
    .replace(/^[——\u3000\s]+/, '')   // remove leading dashes, ideographic space, whitespace
    .trim()
}

async function main() {
  const { data: posts, error } = await supabase.from('posts').select('id, title')
  if (error) { console.error(error.message); process.exit(1) }

  let updated = 0
  for (const post of posts!) {
    const cleaned = cleanTitle(post.title)
    if (cleaned !== post.title) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ title: cleaned })
        .eq('id', post.id)
      if (updateError) {
        console.error(`更新失敗 [${post.id}]:`, updateError.message)
      } else {
        console.log(`✓ "${post.title}" → "${cleaned}"`)
        updated++
      }
    } else {
      console.log(`  (不需修正) "${post.title}"`)
    }
  }

  console.log(`\n完成！修正了 ${updated} 筆標題`)
}

main()
