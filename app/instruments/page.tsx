'use client';

import { useEffect, useState } from 'react';
import InstrumentCard from '@/components/InstrumentCard';
import Header from '@/components/Header';
import { Instrument } from '@/types/instrument';

// Force dynamic rendering, never prerender
export const dynamic = 'force-dynamic';

// Sample data for testing
const sampleInstruments: Instrument[] = [
  {
    id: 1,
    name: 'General Knowledge',
    description: 'Review essential scientific concepts in biology, chemistry, and physics. This section covers fundamental principles and their applications in everyday life.',
    image: '/images/General-Knowledge-Landing.png',
    created_at: new Date().toISOString()
  }
];

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        setIsLoading(true);
        // For now, use sample data instead of fetching from API
        setInstruments(sampleInstruments);
      } catch (err) {
        console.error('Error loading instruments:', err);
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
      <h1 className="text-3xl font-bold text-center mb-8">ASVAB Study Materials</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
        </div>
      )}
    </div>
  );
}
