// Helper function to get a cookie value by name
export function getCookie(name) {
  if (typeof document === 'undefined') return null; // Skip during SSR
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Get the authentication token from cookies
export function getAuthToken() {
  // Check for both 'token' and 'next-auth.session-token' (common NextAuth.js cookie names)
  return getCookie('token') || getCookie('next-auth.session-token');
}
