import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from './markdownToHtml'

const articlesDirectory = path.join(process.cwd(), 'src/content/articles')

export async function getArticleContent(slug: string): Promise<string> {
  const fileNames = fs.readdirSync(articlesDirectory)
  const fileName = fileNames.find((name) => {
    const match = name.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/)
    return match ? match[1] === slug : name.replace(/\.md$/, '') === slug
  })

  if (!fileName) {
    throw new Error(`Article not found: ${slug}`)
  }

  const fullPath = path.join(articlesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { content } = matter(fileContents)

  // Convert Jekyll image_tag to standard markdown images
  const processedContent = content
    .replace(
      /\{%\s*image_tag\s+src="([^"]+)"\s+width="(\d+)"\s*%\}/g,
      '![]($1)',
    )
    .replace(/\{%\s*include\s+[\w.-]+\.(?:html|md)\s*%\}/g, '')

  const html = await markdownToHtml(processedContent)
  return html
}
