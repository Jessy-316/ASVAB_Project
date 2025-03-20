import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide fallbacks for build time when env vars might not be available
const url = supabaseUrl || 'https://placeholder-for-build.supabase.co';
const key = supabaseAnonKey || 'placeholder-key-for-build-only';

// Check if we're in browser, server, or build environment
const isBrowser = typeof window !== 'undefined';
const isVercelBuild = process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD_STEP === true;

// During build on Vercel, don't even try to create a real client
if (isVercelBuild) {
  console.log('Build environment detected, using mock Supabase client');
  // Export a mock client during build to prevent errors
  const mockClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
  
  // @ts-ignore - This is intentional for build-time only
  export const supabase = mockClient;
} else {
  // If we're in the browser, check for real credentials
  if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
    console.error('Missing Supabase environment variables in browser environment');
  }

  // Create the actual client for runtime use
  export const supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
