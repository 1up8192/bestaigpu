import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cleanDistDir: true,
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
