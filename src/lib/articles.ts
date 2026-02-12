import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Article {
  title: string
  date: string
  description: string
  tags: string[]
  thumbnail?: string
  series?: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}

const articlesDirectory = path.join(process.cwd(), 'src/content/articles')

export function getArticleSlugs(): string[] {
  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const match = fileName.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/)
      return match ? match[1] : fileName.replace(/\.md$/, '')
    })
}

export function getArticleBySlug(slug: string): ArticleWithSlug | null {
  const fileNames = fs.readdirSync(articlesDirectory)
  const fileName = fileNames.find((name) => {
    const match = name.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/)
    return match ? match[1] === slug : name.replace(/\.md$/, '') === slug
  })

  if (!fileName) return null

  const fullPath = path.join(articlesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : data.date || ''

  return {
    slug,
    title: data.title || '',
    date,
    description: data.description || '',
    tags: data.tags || [],
    thumbnail: data.thumbnail,
    series: data.series,
  }
}

export function getAllArticles(): ArticleWithSlug[] {
  const fileNames = fs.readdirSync(articlesDirectory)

  const articles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      const match = fileName.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/)
      const slug = match ? match[1] : fileName.replace(/\.md$/, '')

      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] : data.date || ''

      return {
        slug,
        title: data.title || '',
        date,
        description: data.description || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        series: data.series,
      }
    })

  return articles.sort((a, b) => +new Date(b.date) - +new Date(a.date))
}
