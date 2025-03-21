
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic to ensure this is never prerendered
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get Supabase credentials (these will ONLY be used at runtime, not build time)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if we have valid credentials 
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'https://placeholder-for-build.supabase.co' || 
        supabaseKey === 'placeholder-key-for-build-only') {
      // During build or when credentials are missing, return empty array
      console.warn('Missing or invalid Supabase credentials');
      return NextResponse.json([]);
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch instruments from Supabase
    const { data, error } = await supabase
      .from('instruments')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching instruments:', error);
      return NextResponse.json([], { status: 500 });
    }
    
    // Return the instruments data
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
