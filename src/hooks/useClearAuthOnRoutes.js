"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useClearAuthOnRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAuthRoute = ['/login', '/signup', '/register'].includes(pathname);
    
    if (isAuthRoute && typeof window !== 'undefined') {
      // Clear all auth-related data
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies including httpOnly: false
      clearAllCookies();
      
      // Prevent /api/auth/me from being called during auth routes
      if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
          // Prevent /api/auth/me calls on auth routes
          if (typeof args[0] === 'string' && args[0].includes('/api/auth/me')) {
            return Promise.resolve(new Response(JSON.stringify({
              success: false,
              message: 'Not authenticated',
              requiresAuth: true
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
          return originalFetch.apply(this, args);
        };
      }
    }
    
    // Cleanup
    return () => {
      if (window.fetch && window.fetch._original) {
        window.fetch = window.fetch._original;
      }
    };
  }, [pathname]);
};

function clearAllCookies() {
  if (typeof document === 'undefined') return;
  
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  const domain = domainParts.length > 1 
    ? domainParts.slice(-2).join('.')
    : hostname;
  
  // List of all possible auth cookie names to ensure they're cleared
  const authCookieNames = [
    'userSession',
    'token',
    'session',
    'sessionId',
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'auth',
    'auth._token',
    'auth.strategy'
  ];
  
  // Get all cookies currently set
  const cookies = document.cookie ? document.cookie.split(';') : [];
  const cookieNames = new Set();
  
  // Add all existing cookie names
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name) cookieNames.add(name);
  });
  
  // Add all known auth cookie names
  authCookieNames.forEach(name => cookieNames.add(name));
  
  // Clear all cookies with various domain and path combinations
  cookieNames.forEach(name => {
    if (!name) return;
    
    // Clear with domain and root path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    
    // Clear with .domain for subdomains
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
    
    // Clear without domain (for current host only)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    
    // Clear with /api path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api`;
    
    // Clear with domain and /api path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; domain=${domain}`;
    
    // Clear with .domain and /api path
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; domain=.${domain}`;
  });
  
  // Clear all cookies from document.cookie (for good measure)
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
    }
  });
}
