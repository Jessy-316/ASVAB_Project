import { NextRequest, NextResponse } from 'next/server';

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
    
    // In production, redirect to the static HTML file
    if (process.env.NODE_ENV === 'production') {
      // Redirect to the static HTML file
      return NextResponse.rewrite(new URL('/instruments.html', request.url));
    }
  }
  
  // Public routes that should be accessible without authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api',
    '/practice',
    '/instruments',
  ];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (route.endsWith('*')) {
      return url.pathname.startsWith(route.slice(0, -1));
    }
    return url.pathname === route || url.pathname.startsWith(`${route}/`);
  });
  
  // If not a public route, you can implement authentication checks here
  // For now, we're allowing all routes
  
  return response;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
