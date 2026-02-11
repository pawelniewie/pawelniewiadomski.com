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
}

export default nextConfig
