/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

