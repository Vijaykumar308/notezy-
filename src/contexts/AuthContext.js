"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
    // Check auth status immediately when component mounts
    checkAuthStatus();
  }, []);

  // Debug effect to log auth state changes
  useEffect(() => {
    console.log('Auth state updated:', { user, isLoading });
  }, [user, isLoading]);

  const checkAuthStatus = async () => {
    try {
      // First try to get user from server session
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          // Add initials if not present
          const userWithInitials = {
            ...result.user,
            initials: result.user.initials || 
              (result.user.fullname 
                ? result.user.fullname
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2)
                : (result.user.username || 'U').substring(0, 2).toUpperCase())
          };
          
          setUser(userWithInitials);
          localStorage.setItem('user', JSON.stringify(userWithInitials));
          return;
        }
      }

      // Fallback to localStorage if server session is not available
      const localUserData = localStorage.getItem('user');
      if (localUserData) {
        const parsedUser = JSON.parse(localUserData);
        // Ensure initials exist in local storage
        if (!parsedUser.initials) {
          parsedUser.initials = parsedUser.fullname 
            ? parsedUser.fullname
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : (parsedUser.username || 'U').substring(0, 2).toUpperCase();
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (userData) => {
    try {
      // For guest users, just store locally with initials
      if (userData.isGuest) {
        const guestWithInitials = {
          ...userData,
          initials: (userData.name || 'GU').substring(0, 2).toUpperCase()
        };
        setUser(guestWithInitials);
        localStorage.setItem('user', JSON.stringify(guestWithInitials));
        return;
      }

      // For regular users, verify with the server
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          // Ensure initials are set
          const userWithInitials = {
            ...result.user,
            initials: result.user.initials || 
              (result.user.fullname 
                ? result.user.fullname
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2)
                : (result.user.username || 'U').substring(0, 2).toUpperCase())
          };
          
          setUser(userWithInitials);
          localStorage.setItem('user', JSON.stringify(userWithInitials));
          return;
        }
      }

      // Fallback to the provided userData if server verification fails
      const userWithInitials = {
        ...userData,
        initials: userData.fullname 
          ? userData.fullname
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)
          : (userData.username || 'U').substring(0, 2).toUpperCase()
      };
      
      setUser(userWithInitials);
      localStorage.setItem('user', JSON.stringify(userWithInitials));
    } catch (error) {
      console.error('Login error:', error);
      // Still set the user if server verification fails
      const userWithInitials = {
        ...userData,
        initials: (userData.name || userData.username || 'U').substring(0, 2).toUpperCase()
      };
      setUser(userWithInitials);
      localStorage.setItem('user', JSON.stringify(userWithInitials));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API to clear server session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      localStorage.removeItem('user');
      // Redirect to home page
      window.location.href = '/';
    }
  }, []);

  const isLoggedIn = !!user;

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuthStatus // Expose checkAuthStatus for manual refreshes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
