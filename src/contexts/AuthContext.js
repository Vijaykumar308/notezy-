"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if we should prevent auto-login
      const preventAutoLogin = sessionStorage.getItem("preventAutoLogin") === "true";
      
      // Always clear user data if preventAutoLogin is true
      if (preventAutoLogin) {
        setUser(null);
        localStorage.removeItem("user");
        setIsLoading(false);
        return;
      }

      // Check if we're on an auth route
      const isAuthRoute = ['/login', '/register', '/signup'].some(route => 
        window.location.pathname.startsWith(route)
      );

      // Don't proceed with auth check if we're on an auth route
      if (isAuthRoute) {
        setUser(null);
        localStorage.removeItem("user");
        setIsLoading(false);
        return;
      }

      // For non-auth routes, check local storage first
      const localUser = localStorage.getItem("user");
      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
          localStorage.removeItem("user");
        }
      }

      // Skip API check if we're in the middle of logging out
      if (preventAutoLogin || isAuthRoute) {
        setIsLoading(false);
        return;
      }

      // Only make the API call if we have a valid local user
      if (localUser) {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Prevent-Auto-Login": preventAutoLogin ? "true" : "false"
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            setUser(result.user);
            localStorage.setItem("user", JSON.stringify(result.user));
            return;
          }
        }
      }

      // If we get here, the user is not authenticated
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Add empty dependency array to useCallback

  const logout = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        // Set flag to prevent auto-login
        sessionStorage.setItem("preventAutoLogin", "true");
        
        // Clear all auth-related data
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all cookies that might be set
        const hostname = window.location.hostname;
        const domainParts = hostname.split('.');
        const domain = domainParts.length > 1 
          ? domainParts.slice(-2).join('.')
          : hostname;
        
        // List of all possible cookie names to clear
        const cookieNames = [
          'token',
          'userSession',
          'session',
          'sessionId',
          'auth',
          'auth._token',
          'auth.strategy'
        ];
        
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
        
        // Also clear all cookies from document.cookie (for good measure)
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
          }
        });
      }

      // Call server logout to remove httpOnly cookies
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { 
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
        });
      } catch (error) {
        console.error("Logout API error:", error);
      }

      // Force redirect to login with cache-busting
      if (typeof window !== "undefined") {
        // Clear any remaining state
        sessionStorage.clear();
        // Force a hard redirect to ensure all state is cleared
        window.location.href = `/login?logout=${Date.now()}&_=${Date.now()}`;
        // Prevent any further execution
        window.stop();
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/login?error=logout_failed";
      }
    }
  }, []);

  const login = useCallback(async (userData) => {
    try {
      // For guest users
      if (userData.isGuest) {
        const guestUser = {
          ...userData,
          initials: (userData.name || 'GU').substring(0, 2).toUpperCase()
        };
        setUser(guestUser);
        localStorage.setItem('user', JSON.stringify(guestUser));
        return true;
      }

      // For regular users, verify with the server using the login endpoint
      console.log('Attempting login with username:', userData.username);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          rememberMe: true
        })
      });

      const result = await response.json().catch(e => ({
        success: false,
        message: 'Failed to parse response from server'
      }));
      
      console.log('Login response:', { status: response.status, result });

      if (response.ok && result.success) {
        // The user data is in result.user, not result.data.user
        const userData = result.user || {};
        console.log('Login successful for user:', { 
          id: userData.id, 
          username: userData.username,
          email: userData.email 
        });
        
        // Update the user state
        setUser(userData);
        
        // Store user data in localStorage and state
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store the token in both state and localStorage if it exists in the response
        if (result.token) {
          setToken(result.token);
          localStorage.setItem('token', result.token);
        }
        
        return true;
      }

      // If we get here, there was an error
      const errorMessage = result?.message || 'Login failed. Please try again.';
      console.error('Login error:', {
        status: response.status,
        statusText: response.statusText,
        error: result,
        timestamp: new Date().toISOString()
      });
      throw new Error(errorMessage);
    } catch (error) {
      console.error('Login error in AuthContext:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response,
        status: error.status,
        fullError: error
      });
      // Create a new error with the same message but with additional context
      const enhancedError = new Error(error.message || 'Login failed');
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }, []);

  // Get token from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
