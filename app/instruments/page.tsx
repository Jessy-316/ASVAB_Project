// This is a special placeholder for build time
// that switches to client-side rendering at runtime

// Force the page to never be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Placeholder component for build time
export default function InstrumentsPlaceholder() {
  // Import and use the Boot component dynamically so it's only included at runtime
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    // During build, return an empty div to avoid prerendering issues
    return <div data-page="instruments-placeholder" />;
  } else {
    // In development or at runtime, load the Boot component that handles client-side rendering
    const Boot = require('./Boot').default;
    return <Boot />;
  }
}
