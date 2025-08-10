import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// List of all possible auth cookie names
const AUTH_COOKIES = [
  'token',
  'session',
  'sessionId',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'auth',
  'auth._token',
  'auth.strategy',
  'userSession',
  'user-session',
  'user_session',
  'next-auth.callback-url',
  'next-auth.csrf-token'
];

export async function POST(request) {
  try {
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const domain = isLocalhost ? 'localhost' : 
                 host.startsWith('www.') ? host.substring(4) : 
                 host.includes('.') ? `.${host.split('.').slice(-2).join('.')}` : host;

    // Create response with cache control headers
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );

    // Clear all cookies from the request
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    
    // Clear all existing cookies
    allCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });

    // Clear all auth cookies with various combinations of domains, paths, and attributes
    AUTH_COOKIES.forEach(cookieName => {
      // Try all combinations of attributes that might have been used to set the cookie
      const cookieOptions = [
        // Default settings
        { path: '/', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'lax' },
        // API path
        { path: '/api', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'lax' },
        // No domain (for subdomains)
        { path: '/', secure: !isLocalhost, sameSite: 'lax' },
        // Different SameSite settings
        { path: '/', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'strict' },
        { path: '/', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'none' },
        // Different secure settings
        { path: '/', domain: isLocalhost ? undefined : domain, secure: true, sameSite: 'lax' },
        // Different paths
        { path: '/', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'lax' },
        { path: '/app', domain: isLocalhost ? undefined : domain, secure: !isLocalhost, sameSite: 'lax' },
        // Root domain with and without leading dot
        { path: '/', domain: isLocalhost ? undefined : domain.replace(/^\./, ''), secure: !isLocalhost, sameSite: 'lax' },
        { path: '/', domain: isLocalhost ? undefined : `.${domain.replace(/^\./, '')}`, secure: !isLocalhost, sameSite: 'lax' }
      ];

      // Try to clear with each combination of options
      cookieOptions.forEach(options => {
        try {
          response.cookies.set({
            name: cookieName,
            value: '',
            expires: new Date(0),
            ...options
          });
        } catch (e) {
          console.warn(`Failed to clear cookie ${cookieName} with options:`, options, e);
        }
      });
    });

    // Add additional headers to prevent caching and clear site data
    response.headers.set('Clear-Site-Data', '"cookies", "storage", "cache"');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
