import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getArticleBySlug, getArticleSlugs } from '@/lib/articles'
import { getArticleContent } from '@/lib/getArticleContent'
import { ArticleLayout } from '@/components/ArticleLayout'

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  const baseUrl = process.env.BASE_URL || 'https://pawelniewiadomski.com'

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      url: `${baseUrl}/articles/${slug}`,
      images: article.thumbnail
        ? [{ url: `${baseUrl}${article.thumbnail}` }]
        : [],
    },
    twitter: {
      card: article.thumbnail ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.description,
      images: article.thumbnail
        ? [`${baseUrl}${article.thumbnail}`]
        : [],
    },
    alternates: {
      canonical: `${baseUrl}/articles/${slug}`,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const content = await getArticleContent(slug)

  return (
    <ArticleLayout article={article}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ArticleLayout>
  )
}
