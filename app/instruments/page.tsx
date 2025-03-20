'use client';

import { useEffect, useState } from 'react';
import InstrumentCard from '@/components/InstrumentCard';
import Header from '@/components/Header';
import { Instrument } from '@/types/instrument';

// Force dynamic rendering, never prerender
export const dynamic = 'force-dynamic';

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        setIsLoading(true);
        // Use the new API route that will only be called client-side
        const response = await fetch('/api/instruments-bypass');
        
        if (!response.ok) {
          throw new Error(`Error fetching instruments: ${response.status}`);
        }
        
        const data = await response.json();
        setInstruments(data);
      } catch (err) {
        console.error('Error fetching instruments:', err);
        setError('Failed to load instruments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstruments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-8">ASVAB Instruments</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
        </div>
      )}
    </div>
  );
}
