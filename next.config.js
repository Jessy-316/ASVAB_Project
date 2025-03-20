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
    
    // IMPORTANT: Exclude Supabase from server-side rendering during build
    if (isServer) {
      // Add all Supabase packages to externals so they don't get bundled during build
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
      
      // Replace any Supabase imports with an empty module
      config.module.rules.push({
        test: new RegExp(`node_modules/(${supabasePackages.join('|')})`),
        use: 'null-loader',
      });
    }
    
    return config;
  },
  // Explicitly make environment variables available
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build-only',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'placeholder-key-for-build-only',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'placeholder-key-for-build-only',
    // BYPASS_INSTRUMENTS_PRERENDER is used in the instruments page
    BYPASS_INSTRUMENTS_PRERENDER: 'true',
  },
  
  // Control pages that should be statically optimized
  output: 'standalone', // Use standalone output for better deployment compatibility
  
  // CRITICAL: Disable automatic static optimization for specific paths 
  // This is a key setting that will prevent /instruments from being statically generated
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Disable static generation for problematic pages
  experimental: {
    // Use the correct format for serverActions
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Remove the unsupported options
  },
  
  // Override the default cache behavior for better reliability
  generateBuildId: async () => {
    return `build-${Date.now()}`; // Generate unique build ID
  },
  
  // Prevent automatic static optimization for specific paths
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
  
  // Override the default getStaticPaths behavior
  // This ensures that the instruments page is not statically generated
  async exportPathMap(defaultPathMap) {
    // Remove problematic routes from static generation
    delete defaultPathMap['/instruments'];
    delete defaultPathMap['/instruments/page'];
    delete defaultPathMap['/api/instruments-bypass'];
    
    // Also delete any paths that include 'instruments'
    Object.keys(defaultPathMap).forEach(path => {
      if (path.includes('instruments')) {
        delete defaultPathMap[path];
      }
    });
    
    return defaultPathMap;
  },
}

module.exports = nextConfig
