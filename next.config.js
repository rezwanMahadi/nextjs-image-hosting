/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This ensures images work correctly
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
