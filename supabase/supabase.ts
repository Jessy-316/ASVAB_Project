import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check for browser/server/build environment
const isBrowser = typeof window !== 'undefined';
const isVercelBuild = process.env.VERCEL_BUILD_STEP === 'true';

// Create a complete mock client for build time
const createMockClient = () => {
  console.log('Using mock Supabase client for build time');
  
  // Common mock response
  const mockResponse = <T = any>(data: T | null = null) => 
    Promise.resolve({ data, error: null, count: null, status: 200, statusText: 'OK' });
  
  // Create mock query builder
  const createMockQueryBuilder = (tableName: string) => ({
    select: () => mockResponse([]),
    insert: () => mockResponse(null),
    update: () => mockResponse(null),
    delete: () => mockResponse(null),
    upsert: () => mockResponse(null),
    eq: () => createMockQueryBuilder(tableName),
    neq: () => createMockQueryBuilder(tableName),
    gt: () => createMockQueryBuilder(tableName),
    lt: () => createMockQueryBuilder(tableName),
    gte: () => createMockQueryBuilder(tableName),
    lte: () => createMockQueryBuilder(tableName),
    is: () => createMockQueryBuilder(tableName),
    in: () => createMockQueryBuilder(tableName),
    contains: () => createMockQueryBuilder(tableName),
    containedBy: () => createMockQueryBuilder(tableName),
    range: () => createMockQueryBuilder(tableName),
    textSearch: () => createMockQueryBuilder(tableName),
    filter: () => createMockQueryBuilder(tableName),
    or: () => createMockQueryBuilder(tableName),
    and: () => createMockQueryBuilder(tableName),
    not: () => createMockQueryBuilder(tableName),
    match: () => createMockQueryBuilder(tableName),
    single: () => mockResponse(null),
    maybeSingle: () => mockResponse(null),
    limit: () => createMockQueryBuilder(tableName),
    order: () => createMockQueryBuilder(tableName),
    range: () => createMockQueryBuilder(tableName),
  });
  
  // Create the mock client
  return {
    from: (tableName: string) => createMockQueryBuilder(tableName),
    // @ts-ignore
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    // @ts-ignore
    storage: {
      from: () => ({
        upload: () => mockResponse({ path: 'mock-path' }),
        download: () => mockResponse(new Blob()),
        getPublicUrl: () => ({ data: { publicUrl: 'https://mock-url.com' } }),
        list: () => mockResponse([]),
        remove: () => mockResponse({}),
      }),
    },
    rest: {
      // @ts-ignore
      get: () => mockResponse({}),
      post: () => mockResponse({}),
      put: () => mockResponse({}),
      delete: () => mockResponse({}),
    },
  };
};

// Export different client based on environment
let supabase;

// During build/SSR when VERCEL_BUILD_STEP is set, use mock client
if ((isVercelBuild || !isBrowser) && (!supabaseUrl || !supabaseAnonKey)) {
  // @ts-ignore - intentional for build-time only
  supabase = createMockClient();
} else {
  // For browser or when proper credentials exist, create real client
  try {
    // Only log missing credentials in browser
    if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
      console.error('Missing Supabase environment variables in browser environment');
    }
    
    // Use real credentials or fallbacks
    const url = supabaseUrl || 'https://placeholder-for-build.supabase.co';
    const key = supabaseAnonKey || 'placeholder-key-for-build-only';
    
    supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    // Fallback to mock client if creation fails
    // @ts-ignore - intentional fallback for error cases
    supabase = createMockClient();
  }
}

export { supabase };
