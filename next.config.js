/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure images work correctly
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
