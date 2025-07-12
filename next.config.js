/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'notion.so'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig