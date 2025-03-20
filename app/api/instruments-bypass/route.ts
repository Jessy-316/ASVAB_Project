import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Instrument } from '@/types/instrument';

// Ensure this route is never statically generated
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get environment variables (these will only be accessed at runtime, not build time)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if we have valid credentials
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'https://placeholder-for-build.supabase.co' || 
        supabaseKey === 'placeholder-key-for-build-only') {
      console.error('Missing or invalid Supabase credentials in API route');
      // Return empty data during build or when credentials are missing
      return NextResponse.json([]);
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch instruments
    const { data, error } = await supabase
      .from('instruments')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching instruments:', error);
      return NextResponse.json([], { status: 500 });
    }
    
    // Map the data to match the Instrument type
    const instruments: Instrument[] = data.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image || '/images/default-instrument.jpg',
      description: item.description || 'No description available.',
      sound: item.sound || null,
      created_at: item.created_at
    }));
    
    return NextResponse.json(instruments);
  } catch (error) {
    console.error('Unexpected error in instruments API route:', error);
    return NextResponse.json([], { status: 500 });
  }
} 
