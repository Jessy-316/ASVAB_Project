/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable webpack optimization to avoid issues with module resolution
  webpack: (config, { isServer }) => {
    // Disable optimization
    config.optimization.minimize = false;
    
    // Disable code splitting to avoid chunk loading issues
    config.optimization.splitChunks = false;
    
    return config;
  },
  // Explicitly make environment variables available
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build-only',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'placeholder-key-for-build-only',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'placeholder-key-for-build-only',
  },
  // Control pages that should be statically optimized
  output: 'standalone', // Use standalone output for better deployment compatibility
  
  // Disable static generation for problematic pages
  experimental: {
    // Ensure SSR for dynamic pages
    serverActions: true,
    // Disable esmExternals
    esmExternals: false,
  },
  
  // Set specific options for production builds on Vercel
  distDir: process.env.VERCEL ? '.vercel/output/static' : '.next',
  
  // Override the default cache behavior for better reliability
  generateBuildId: async () => {
    return `build-${Date.now()}`; // Generate unique build ID
  },
  
  // Prevent automatic static optimization for specific paths
  async rewrites() {
    return [
      {
        source: '/instruments',
        destination: '/instruments',
        has: [
          {
            type: 'header',
            key: 'x-middleware-skip',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
