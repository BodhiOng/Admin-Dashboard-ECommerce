'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // If user is not authenticated, redirect to login
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // This is shown briefly before redirect
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-2xl text-center px-8 py-12 rounded-2xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-left">
          Welcome to Your Admin Dashboard
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-xl leading-normal text-left">
            One dashboard to run your e-commerce business:
            seamless management, real-time analytics.
          </p>
          <p className="text-sm leading-normal text-left">
            Your business insights await!
            Choose a section from the navigation to unlock
            powerful analytics and management tools.
          </p>
        </div>
      </div>
    </div>
  );
}