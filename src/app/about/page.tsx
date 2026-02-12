import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpeg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    "I'm Pawel Niewiadomski. A software developer with a passion for building great products.",
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Pawel Niewiadomski"
              width={400}
              height={400}
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I&apos;m Pawel Niewiadomski. A software developer with a passion for
            building great products.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I worked as a contractor for Atlassian for over 7 years. During
              that time I learned how to create awesome products people love to
              use, how to support them and how to evolve them. I also witnessed
              how technology debt can accumulate over time and helped fight it.
            </p>
            <p>
              At Atlassian I worked on FishEye/Crucible, Atlassian Connectors
              for Eclipse, and for the most time Jira and core plugins
              (Importers, Issue Copy, Auditing, User/Project key rename).
            </p>
            <p>
              I admire Atlassian for building a consistent set of tools that
              integrate easily with each other making the sum much larger than
              each product alone.
            </p>
            <p>
              I love bootstrapping new projects, performance optimization,
              refactoring complex code bases and bringing order to teams and
              projects.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list" className="flex flex-col gap-4">
            <SocialLink
              href="https://x.com/pawelniewie"
              icon={XIcon}
              aria-label="Follow on X"
            >
              Follow on X
            </SocialLink>
            <SocialLink
              href="https://instagram.com/life_of_pawel"
              icon={InstagramIcon}
              aria-label="Follow on Instagram"
            >
              Follow on Instagram
            </SocialLink>
            <SocialLink
              href="https://github.com/pawelniewie"
              icon={GitHubIcon}
              aria-label="Follow on GitHub"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://linkedin.com/in/pawelniewiadomski"
              icon={LinkedInIcon}
              aria-label="Follow on LinkedIn"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:pawel@pawelniewiadomski.com"
              icon={MailIcon}
              className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-700/40"
              aria-label="Send me an email"
            >
              pawel@pawelniewiadomski.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
