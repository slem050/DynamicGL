/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  // Only use static export for GitHub Pages builds
  ...(isGitHubPages && { output: 'export' }),
  // Only use basePath for GitHub Pages
  ...(isGitHubPages && { basePath: '/DynamicGL' }),
  transpilePackages: ['@dynamicgl/react', '@dynamicgl/core', '@dynamicgl/charts', '@dynamicgl/theme'],
  webpack: (config, { isServer }) => {
    // Handle workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

module.exports = nextConfig;

