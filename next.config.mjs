/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pawelniewiadomski.com',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old Jekyll permalink format (/:year/:month/:day/:slug/)
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/',
        destination: '/articles/:slug',
        permanent: true,
      },
      // Same without trailing slash
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
      // Old /archive/ page
      {
        source: '/archive',
        destination: '/articles',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ]
  },
}

export default nextConfig
