import Link from 'next/link'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

export default async function Home() {
  let articles = (getAllArticles()).slice(0, 5)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Software developer, builder, and problem solver.
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I&apos;m Pawel Niewiadomski, a software developer with a passion for
            building great products. I share observations on software
            development, life, and all the things.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com/devonsteroids"
              aria-label="Follow on X"
              icon={XIcon}
            />
            <SocialLink
              href="https://github.com/pawelniewie"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com/in/pawelniewiadomski"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
              <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <span>About</span>
              </h2>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                I worked as a contractor for Atlassian for over 7 years. I love
                bootstrapping new projects, performance optimization, refactoring
                complex code bases, and bringing order to teams and projects.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center text-sm font-medium text-teal-500"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
