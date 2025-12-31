/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Static export for GitHub Pages
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

