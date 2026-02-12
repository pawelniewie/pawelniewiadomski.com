import { Feed } from 'feed'
import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const siteUrl = process.env.BASE_URL || 'https://pawelniewiadomski.com'

  const author = {
    name: 'Pawel Niewiadomski',
    email: 'pawel@pawelniewiadomski.com',
  }

  const feed = new Feed({
    title: 'Pawel Niewiadomski',
    description:
      'A few observations on the world of software development, life and all the things.',
    author,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Pawel Niewiadomski`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  const articles = getAllArticles()

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      id: `${siteUrl}/articles/${article.slug}`,
      link: `${siteUrl}/articles/${article.slug}`,
      description: article.description,
      author: [author],
      date: new Date(article.date),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=31556952',
    },
  })
}
