import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This API route will not be prerendered
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const fetchCache = 'force-no-store';

// This is the API route handler for instruments data
export async function GET() {
  try {
    // Get supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Basic error handling to prevent build-time errors 
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Supabase credentials are not configured' },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch instruments data
    const { data, error } = await supabase.from('instruments').select();

    if (error) {
      console.error('Error fetching instruments:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return instruments data
    return NextResponse.json(
      { instruments: data },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
