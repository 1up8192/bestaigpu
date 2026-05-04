import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
