/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // Set the base path for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES 
    ? '/smart_traffic_management_and_speed_violation_detection_system' 
    : '',
  // Set asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES 
    ? '/smart_traffic_management_and_speed_violation_detection_system/' 
    : '',
}

export default nextConfig
