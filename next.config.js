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
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  // Configure which paths should be processed and which should be skipped during build
  exportPathMap: async function () {
    // Return empty map to skip static generation for all pages
    return {};
  },
  // Set all pages to be dynamically rendered during runtime
  trailingSlash: true,
  // Turn off experimental esmExternals as it's causing issues
  experimental: {
    // esmExternals flag is causing issues, so use 'loose' mode
    // but disable it completely in the future
    esmExternals: false,
  },
}

module.exports = nextConfig
