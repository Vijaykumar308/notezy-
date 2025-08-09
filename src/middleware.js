import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

// Define public paths that don't require authentication
const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for authentication token - try both 'accessToken' and 'token' cookie names
  const accessToken = request.cookies.get('accessToken')?.value;
  const token = request.cookies.get('token')?.value;
  const authToken = accessToken || token;
  
  // For API routes, return JSON response
  if (pathname.startsWith('/api/')) {
    // Skip auth check for login and auth-related endpoints
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    if (!authToken) {
      console.log('No auth token found in cookies');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized - No authentication token found',
          cookies: request.cookies.getAll().map(c => c.name)
        },
        { status: 401 }
      );
    }

    try {
      console.log('Verifying token in middleware...');
      // Verify the token
      await verifyToken(authToken);
      console.log('Token verified successfully in middleware');
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed in middleware:', {
        error: error.message,
        name: error.name,
        token: authToken ? `${authToken.substring(0, 10)}...` : 'No token',
        cookies: request.cookies.getAll().map(c => c.name)
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token',
          error: error.message,
          errorName: error.name
        },
        { status: 401 }
      );
    }
  }

  // For page routes, redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('session', 'expired');
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
