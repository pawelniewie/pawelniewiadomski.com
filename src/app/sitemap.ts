import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.BASE_URL || 'https://pawelniewiadomski.com'

  const articles = getAllArticles()

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...articleEntries,
  ]
}
