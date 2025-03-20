import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide fallbacks for build time when env vars might not be available
const url = supabaseUrl || 'https://fallbackurl.supabase.co';
const key = supabaseAnonKey || 'fallback_key_for_build_time_only';

// Check if we're in browser or server environment
const isBrowser = typeof window !== 'undefined';

// If we're in the browser, ensure we have real credentials or throw an error
if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables in browser environment');
}

export const supabase = createClient(url, key);
