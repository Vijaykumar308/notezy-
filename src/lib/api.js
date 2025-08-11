/**
 * Utility function for making authenticated API requests
 * Automatically includes the auth token in the request headers
 */

export const apiRequest = async (url, options = {}) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Important for cookies
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Redirect to login with a flag to show session expired message
        window.location.href = '/login?session=expired';
      }
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper function for GET requests
export const get = (url, options = {}) => 
  apiRequest(url, { ...options, method: 'GET' });

// Helper function for POST requests
export const post = (url, data = {}, options = {}) => 
  apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  });

// Helper function for PUT requests
export const put = (url, data = {}, options = {}) =>
  apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  });

// Helper function for DELETE requests
export const del = (url, options = {}) =>
  apiRequest(url, { ...options, method: 'DELETE' });
