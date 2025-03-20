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
    if (req.nextUrl.pathname.startsWith('/instruments')) {
      const response = NextResponse.next();
      response.headers.set('x-middleware-skip', 'true');
      return response;
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
