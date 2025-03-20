'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Loading component shown while the client page is loading
function LoadingComponent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Instruments</h1>
      <p>Loading instruments interface...</p>
    </div>
  );
}

// Dynamically import the actual client-side component with SSR disabled
// This ensures it never gets included in the server build
const ClientPage = dynamic(
  () => import('./page.client'),
  { ssr: false, loading: () => <LoadingComponent /> }
);

// Boot component that only runs on the client
export default function Boot() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Only mount the component on the client
    setIsMounted(true);
  }, []);
  
  // During server rendering, return the loading component
  if (!isMounted) {
    return <LoadingComponent />;
  }
  
  // On the client, render the dynamic content
  return <ClientPage />;
} 
