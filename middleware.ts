import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

// Handle redirects for the instruments route
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Create response object to send headers
  const response = NextResponse.next();
  
  // Add a header with the current path for use in layout
  response.headers.set('x-pathname', url.pathname);
  
  // Special handling for the instruments route
  if (url.pathname.startsWith('/instruments')) {
    // Add header to bypass static generation
    response.headers.set('x-middleware-skip', 'true');
    
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // During build, don't proceed to the instruments route
    if (process.env.VERCEL_ENV === 'production' && process.env.NODE_ENV === 'production' && process.env.SKIP_STATIC_GENERATION === 'true') {
      // Special handling to prevent access during build
      return response;
    }
  }
  
  return response;
}

// This middleware will run before Clerk Auth
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
    '/practice(.*)',
    '/instruments(.*)', // Explicitly add instruments to public routes
  ],
  beforeAuth: (req) => {
    // Run the instruments middleware
    return middleware(req);
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
