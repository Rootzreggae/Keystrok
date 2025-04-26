/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['v0.blob.com'],
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/Keystrok' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Keystrok/' : '',
  trailingSlash: true,
}

export default nextConfig;
