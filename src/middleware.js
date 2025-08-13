import { NextResponse } from 'next/server';

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
  '/_error'
];

// Auth-related cookies to check
const AUTH_COOKIES = [
  'token',
  'accessToken',
  'refreshToken',
  'userSession',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'session',
  'sessionId',
  'userId',
  'auth._token',
  'auth._token_expiration'
];

// Check if the request is for a public path
const isPublicPath = (pathname) => {
  return PUBLIC_PATHS.some(path => 
    pathname === path || 
    pathname.startsWith(path + '/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.')
  );
};

// Check if user is authenticated
const isAuthenticated = (request) => {
  // First check for the token in cookies
  const hasValidCookie = AUTH_COOKIES.some(
    cookie => {
      const value = request.cookies.get(cookie)?.value;
      return value && value !== 'undefined' && value !== 'null' && value !== '';
    }
  );
  
  // Also check for Authorization header
  const authHeader = request.headers.get('authorization');
  const hasValidAuthHeader = authHeader && authHeader.startsWith('Bearer ');
  
  return hasValidCookie || hasValidAuthHeader;
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths and static files
  if (isPublicPath(pathname)) {
    const response = NextResponse.next();
    
    // Don't cache auth-related pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      response.headers.set('Pragma', 'no-cache');
    }
    
    return response;
  }

  // For API routes
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated(request)) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized',
          error: 'Authentication required'
        }), 
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        }
      );
    }
    
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For page routes
  if (!isAuthenticated(request)) {
    // Create redirect response to login
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    const response = NextResponse.redirect(loginUrl);
    
    // Clear any existing auth cookies
    AUTH_COOKIES.forEach(cookie => {
      response.cookies.set(cookie, '', { 
        path: '/', 
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      // Clear for localhost in development
      if (process.env.NODE_ENV !== 'production') {
        response.cookies.set(cookie, '', {
          path: '/',
          domain: 'localhost',
          expires: new Date(0),
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        });
      }
    });
    
    return response;
  }

  // For authenticated users, add security headers
  const response = NextResponse.next();
  
  // Check if we're on login or register page
  const isAuthPage = request.nextUrl.pathname === '/login' || 
                    request.nextUrl.pathname === '/register' ||
                    request.nextUrl.pathname === '/login/' ||
                    request.nextUrl.pathname === '/register/';

  // Clear all cookies on auth pages
  if (isAuthPage) {
    // Get all cookies
    const cookies = request.headers.get('cookie') || '';
    const cookieList = cookies.split(';').map(cookie => cookie.trim().split('=')[0]);
    
    // Clear each cookie
    cookieList.forEach(cookieName => {
      if (cookieName) {
        response.cookies.set({
          name: cookieName,
          value: '',
          path: '/',
          expires: new Date(0),
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
      }
    });

    // Clear all possible auth cookies to be extra sure
    const authCookies = ['accessToken', 'token', 'session', 'userSession', 'auth'];
    authCookies.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    });
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache control for authenticated pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
