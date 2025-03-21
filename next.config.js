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
    // Disable optimization for more reliable builds
    config.optimization.minimize = false;
    
    // Exclude Supabase from server-side rendering during build
    if (isServer) {
      const supabasePackages = [
        '@supabase/supabase-js',
        '@supabase/auth-helpers-nextjs',
        '@supabase/auth-helpers-react',
        '@supabase/auth-ui-react',
        '@supabase/auth-ui-shared',
        '@supabase/functions-js',
        '@supabase/gotrue-js',
        '@supabase/realtime-js',
        '@supabase/storage-js',
        '@supabase/postgrest-js',
      ];
      
      // Add all Supabase packages to externals
      config.externals = [
        ...(config.externals || []),
        ...supabasePackages,
      ];
    }
    
    return config;
  },
  // Explicitly make environment variables available with fallbacks
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjghcdrxzziloqzehlud.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZ2hjZHJ4enppbG9xemVobHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2ODIwOTgsImV4cCI6MjA1NDI1ODA5OH0.m1K31aZB2JAbFErBaPPIfN6zwyUvXRxoHPa87-c-_Zg',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'placeholder-key-for-build-only',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'placeholder-key-for-build-only',
    // BYPASS_INSTRUMENTS_PRERENDER is used in the instruments page
    BYPASS_INSTRUMENTS_PRERENDER: 'true',
  },
  
  // Output as standalone build for better performance
  output: 'standalone',
  
  // Allowed page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Simplified experimental section
  experimental: {
    // Next.js 15 style serverActions config
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  
  // Unique build ID to prevent caching issues
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Simplified rewrites
  async rewrites() {
    return [
      {
        source: '/instruments',
        destination: '/instruments.html',
      },
      {
        source: '/instruments/:path*',
        destination: '/instruments.html',
      },
    ];
  },
}

module.exports = nextConfig
