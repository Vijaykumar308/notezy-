'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useClearAuthOnRoutes } from '@/hooks/useClearAuthOnRoutes';
import Link from 'next/link';
import {toast} from 'react-toastify';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  // Clear any auth data when on login page
  useClearAuthOnRoutes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous toasts
    toast.dismiss();
    setIsLoading(true);

    try {
      // Clear any existing auth state before login
      localStorage.removeItem('user');
      
      // Use the login function from AuthContext
      const loginSuccess = await login({
        username: username.trim(),
        password,
        rememberMe: true
      });
      
      // If we get here, login was successful
      if (loginSuccess) {
        const redirectTo = searchParams.get('redirect') || '/';
        console.log('Login successful, redirecting to:', redirectTo);
        
        // Show success message
        toast.success('Login successful!', {
          duration: 1000,
          position: 'top-center'
        });
        
        // Short delay to show the success message, then redirect
        setTimeout(() => {
          // Use window.location.href for a full page reload to ensure all auth state is properly loaded
          window.location.href = redirectTo;
        }, 500);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      // Get the error message from the response if available
      const errorData = err.response ? await err.response.json() : null;
      const errorMessage = errorData?.message || err.message || 'Login failed. Please check your credentials and try again.';
      
      // Log detailed error for debugging
      console.error('Login error details:', {
        error: err,
        response: errorData,
        timestamp: new Date().toISOString()
      });
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
