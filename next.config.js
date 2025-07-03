/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['letstruck.com'],
  },
}

module.exports = nextConfig