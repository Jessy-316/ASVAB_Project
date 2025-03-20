'use client';

import { useEffect, useState } from 'react';

// This is a client-side only component that fetches instruments data through an API route
export default function InstrumentsClientPage() {
  const [instruments, setInstruments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    async function fetchInstruments() {
      try {
        setLoading(true);
        
        // Fetch instruments data from our API route
        // This route doesn't get pre-rendered during build time
        const response = await fetch('/api/instruments-bypass', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch instruments');
        }
        
        const data = await response.json();
        setInstruments(data.instruments);
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
        <p>Loading instruments data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Instruments</h1>
        <p className="text-red-500">Error: {error}</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
          <ul className="list-disc pl-5">
            <li>Check that your Supabase environment variables are set correctly</li>
            <li>Verify that the 'instruments' table exists in your Supabase database</li>
            <li>Ensure you have permission to access this table</li>
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Instruments</h1>
      <div className="mb-4">
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          Successfully loaded {instruments?.length || 0} instruments
        </span>
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
        {JSON.stringify(instruments, null, 2)}
      </pre>
    </div>
  );
} 
