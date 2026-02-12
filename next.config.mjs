/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
}

export default nextConfig
