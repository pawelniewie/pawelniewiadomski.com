import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.BASE_URL || 'https://pawelniewiadomski.com',
  ),
  title: {
    template: '%s - Pawel Niewiadomski',
    default:
      'Pawel Niewiadomski - Software developer, builder, and problem solver',
  },
  description:
    'A few observations on the world of software development, life and all the things. By Pawel Niewiadomski.',
  openGraph: {
    title: 'Pawel Niewiadomski',
    description:
      'A few observations on the world of software development, life and all the things.',
    url: process.env.BASE_URL || 'https://pawelniewiadomski.com',
    siteName: 'Pawel Niewiadomski',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pawel Niewiadomski',
    description:
      'A few observations on the world of software development, life and all the things.',
    creator: '@devonsteroids',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
