import fs from 'fs'
import path from 'path'

const POSTS_DIR = '/Users/pawel/Development/pawelniewie/pawelniewiadomski.com/_posts'
const MEDIA_DIR = '/Users/pawel/Development/pawelniewie/pawelniewiadomski.com/media'
const OUTPUT_DIR = path.resolve('src/content/articles')
const IMAGES_DIR = path.resolve('public/images')

// Simple YAML frontmatter parser (avoids needing gray-matter installed)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content }

  const frontmatterStr = match[1]
  const body = match[2]
  const data = {}

  let currentKey = null
  let currentArray = null

  for (const line of frontmatterStr.split('\n')) {
    const keyValue = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/)
    if (keyValue) {
      currentKey = keyValue[1]
      const value = keyValue[2].trim()
      if (value === '') {
        data[currentKey] = []
        currentArray = currentKey
      } else {
        data[currentKey] = value
        currentArray = null
      }
    } else if (currentArray && line.match(/^-\s+(.+)$/)) {
      const item = line.match(/^-\s+(.+)$/)[1].trim()
      data[currentArray].push(item)
    }
  }

  return { data, content: body }
}

function stripMarkdown(text) {
  return text
    .replace(/\{%[^%]*%\}/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*`_~>]/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

function generateDescription(content) {
  const text = stripMarkdown(content)
  if (text.length <= 160) return text
  return text.substring(0, 157).replace(/\s+\S*$/, '') + '...'
}

function processContent(content) {
  return content
    // Convert Jekyll image_tag to markdown images
    .replace(
      /\{%\s*image_tag\s+src="([^"]+)"\s+width="(\d+)"\s*%\}/g,
      (_, src) => {
        const newSrc = src.replace(/^\/media\//, '/images/')
        return `![](${newSrc})`
      },
    )
    // Remove Jekyll include tags
    .replace(/\{%\s*include\s+[\w.-]+\.(?:html|md)\s*%\}\n?/g, '')
}

// Ensure directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.mkdirSync(IMAGES_DIR, { recursive: true })

// Copy media files
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('Copying media files...')
copyDir(MEDIA_DIR, IMAGES_DIR)
console.log('Media files copied.')

// Process blog posts
const files = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()

console.log(`Found ${files.length} blog posts to migrate.`)

let migrated = 0

for (const fileName of files) {
  const filePath = path.join(POSTS_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = parseFrontmatter(raw)

  // Extract date from filename
  const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''

  // Process content
  const processedContent = processContent(content)

  // Generate description if not present
  const description = data.description || generateDescription(content)

  // Update thumbnail path
  const thumbnail = data.thumbnail
    ? data.thumbnail.replace(/^\/media\//, '/images/')
    : undefined

  // Build new frontmatter
  const frontmatter = ['---']
  const title = String(data.title || '').replace(/"/g, '\\"')
  frontmatter.push(`title: "${title}"`)
  frontmatter.push(`date: "${date}"`)
  const desc = String(description).replace(/"/g, '\\"').replace(/\n/g, ' ')
  frontmatter.push(`description: "${desc}"`)


  if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
    frontmatter.push('tags:')
    for (const tag of data.tags) {
      frontmatter.push(`  - ${tag}`)
    }
  }

  if (thumbnail) {
    frontmatter.push(`thumbnail: "${thumbnail}"`)
  }

  if (data.series) {
    frontmatter.push(`series: "${data.series}"`)
  }

  frontmatter.push('---')

  const output = frontmatter.join('\n') + '\n' + processedContent

  const outputPath = path.join(OUTPUT_DIR, fileName)
  fs.writeFileSync(outputPath, output)
  migrated++
  console.log(`  Migrated: ${fileName}`)
}

console.log(`\nMigration complete: ${migrated} posts migrated.`)
