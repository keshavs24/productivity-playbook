import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Exclude legacy Google Apps Script and old PWA from compilation
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
