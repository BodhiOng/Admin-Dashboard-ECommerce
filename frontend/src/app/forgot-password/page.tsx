'use client';

import React, { useState } from 'react';
import { FaKey } from 'react-icons/fa';
import Link from 'next/link';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden h-screen w-screen absolute inset-0 bg-gray-100 flex flex-col">
        <div className="flex-grow flex flex-col justify-center px-6 py-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <FaKey className="mx-auto text-8xl text-blue-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Forgot Password
            </h1>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {!isSubmitted ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
                >
                  {loading ? 'Processing...' : 'Reset Password'}
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-lg">
                <p className="text-gray-800 text-lg mb-4">
                  You will receive password reset instructions in your personal email shortly.
                </p>
                <Link 
                  href="/login" 
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                >
                  Back to Login
                </Link>
              </div>
            )}
            {!isSubmitted && (
              <p className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                  Back to Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex h-screen w-screen absolute inset-0 flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
        <div className="text-center max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <FaKey className="mx-auto text-8xl text-blue-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Forgot Password
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {!isSubmitted ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <input
                id="email-desktop"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-800 text-lg mb-4">
                If an account exists with this email, you will receive password reset instructions shortly.
              </p>
              <Link 
                href="/login" 
                className="w-full inline-flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                Back to Login
              </Link>
            </div>
          )}
          {!isSubmitted && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Back to Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
