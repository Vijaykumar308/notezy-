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
        clearAuthData();
        return;
      }

      // Check if we're on an auth route
      const isAuthRoute = ['/login', '/register', '/signup'].some(route => 
        window.location.pathname.startsWith(route)
      );

      // Don't proceed with auth check if we're on an auth route
      if (isAuthRoute) {
        clearAuthData();
        return;
      }

      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          // Verify the token with the server
          const response = await fetch("/api/auth/verify-token", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              setUser(result.user);
              localStorage.setItem("user", JSON.stringify(result.user));
              return;
            }
          }
        } catch (e) {
          console.error("Error during auth check:", e);
        }
      }

      // If we get here, the user is not authenticated
      clearAuthData();
    } catch (error) {
      console.error("Error checking auth status:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.token && data.user) {
        // Store the token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        sessionStorage.removeItem("preventAutoLogin");
        return { success: true };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    // Clear all auth data
    clearAuthData();
    
    // Prevent auto-login on next page load
    sessionStorage.setItem("preventAutoLogin", "true");
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!user && !!getToken();
  }, [user, getToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        getToken,
        isAuthenticated,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
