/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure images work correctly
  images: {
    unoptimized: true,
  },
  // Add this to ensure the /public/uploads directory is served properly in production
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
