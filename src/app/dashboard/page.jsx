'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {user.initials ? (
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.initials}
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">U</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.fullname || user.username}!</h1>
              <p className="text-gray-500">You're now logged in.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="mt-1 text-sm text-gray-900">{user.username}</p>
              </div>
              {user.email && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              )}
              {user.role && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
