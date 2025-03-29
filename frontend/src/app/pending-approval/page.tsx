'use client';

import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden h-screen w-screen absolute inset-0 bg-gray-100 flex flex-col">
        <div className="flex-grow flex flex-col justify-center px-6 py-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <FaClock className="mx-auto text-8xl text-blue-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Pending Approval
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Your application to become an admin is currently under review. You will be notified once the process is complete. Thank you for your patience!
            </p>
            <Link 
              href="/login" 
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex h-screen w-screen absolute inset-0 flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
        <div className="text-center max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <FaClock className="mx-auto text-8xl text-blue-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Pending Approval
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Your application to become an admin is currently under review. You will be notified once the process is complete. Thank you for your patience!
          </p>
          <Link 
            href="/login" 
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </>
  );
}
