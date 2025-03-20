// This file helps bypass static generation for routes that require
// access to environment variables or database during build time
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// List of paths that should bypass static generation
const CLIENT_ONLY_PATHS = ['/instruments'];

export function useBypassStatic(path) {
  const router = useRouter();
  
  useEffect(() => {
    // Check if the current path should be client-only
    if (CLIENT_ONLY_PATHS.some(clientPath => path.startsWith(clientPath))) {
      // Force a client-side navigation to the same page
      // This bypasses any static content generated during build
      const url = new URL(window.location.href);
      url.searchParams.set('_bypass', Date.now());
      router.replace(url.pathname + url.search);
    }
  }, [path, router]);
}

// Helper component to force client rendering
export function BypassStaticWrapper({ children, currentPath }) {
  useBypassStatic(currentPath || '');
  return children;
} 
