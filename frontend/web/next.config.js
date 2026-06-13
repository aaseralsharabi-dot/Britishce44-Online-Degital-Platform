/**
 * Next.js Build Optimization Configuration
 * Implements best practices for bundle size and performance
 */

module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true, // Use SWC for faster minification
  compress: true,

  // Image optimization
  images: {
    domains: ['storage.britishce44.edu', 'avatars.britishce44.edu'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // API routes rewrites for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_GATEWAY_URL || 'http://localhost:3000'}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${process.env.WS_URL || 'http://localhost:3002'}/socket.io/:path*`,
      },
    ]
  },

  // Custom webpack configuration for optimization
  webpack: (config, { isServer }) => {
    // Alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname + '/src',
    }

    // Module alias optimization
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }

    // Code splitting optimization
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              priority: 10,
              reuseExistingChunk: true,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                return `npm.${packageName.replace('@', '')}`
              },
            },
            // React chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              filename: 'chunks/react.js',
              priority: 20,
            },
            // Common chunk
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              filename: 'chunks/common.js',
            },
          },
        },
      }
    }

    return config
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(self)',
          },
        ],
      },
    ]
  },
}
