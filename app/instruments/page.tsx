'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Force the page to be rendered on the client side only
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Run on edge runtime only
export const preferredRegion = 'auto'; // Automatically choose the closest region

// Tell Next.js this should never be prerendered
export const revalidate = 0;

export default function Instruments() {
  const [instruments, setInstruments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    async function fetchInstruments() {
      try {
        setLoading(true);
        
        // Create Supabase client on the client side only
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        // Check if environment variables are available
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase environment variables are not configured');
        }
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        const { data, error } = await supabase.from('instruments').select();
        
        if (error) {
          throw error;
        }
        
        setInstruments(data);
      } catch (err: any) {
        console.error('Error fetching instruments:', err);
        setError(err.message || 'Failed to load instruments');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInstruments();
  }, []);
  
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Instruments</h1>
        <p>Loading instruments...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Instruments</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Instruments</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
        {JSON.stringify(instruments, null, 2)}
      </pre>
    </div>
  );
}
