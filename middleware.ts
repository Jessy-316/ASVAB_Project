import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
    '/practice(.*)',
    '/instruments(.*)',
  ],
  afterAuth(auth, req) {
    const response = NextResponse.next();
    
    response.headers.set('x-pathname', req.nextUrl.pathname);
    
    if (req.nextUrl.pathname.startsWith('/instruments')) {
      response.headers.set('x-middleware-skip', 'true');
      response.headers.set('Cache-Control', 'no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
