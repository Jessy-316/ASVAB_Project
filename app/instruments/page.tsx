'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Force client-side only rendering
export const dynamic = 'force-dynamic';

// Completely opt out of static rendering and prerendering
export const runtime = 'edge';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';

// This is a placeholder component that will be shown during build
function InstrumentsPlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Instruments</h1>
      <p>Loading instruments...</p>
    </div>
  );
}

// Dynamically import the real component with SSR disabled
// This ensures it only runs on the client side
const DynamicInstrumentsContent = dynamic(
  () => import('./InstrumentsContent'),
  { 
    ssr: false,
    loading: () => <InstrumentsPlaceholder />
  }
);

// The main component that's exported - this is what gets rendered at build time
export default function Instruments() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // During build/SSR, just show the placeholder
  if (!isMounted) {
    return <InstrumentsPlaceholder />;
  }
  
  // On the client, render the dynamic content
  return (
    <Suspense fallback={<InstrumentsPlaceholder />}>
      <DynamicInstrumentsContent />
    </Suspense>
  );
}
