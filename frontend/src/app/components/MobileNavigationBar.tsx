"use client";
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

// Mobile navigation bar for the admin dashboard
export default function MobileNavigationBar({ className }: { className?: string }) {
  // Get the current pathname to determine active navigation item
  const pathname = usePathname();

  const activeTab = pathname.split('/')[1] || '';

  const { logout } = useAuth();

  return (
    // Mobile navigation bar with dark background and flexible layout
    <nav className={`fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center p-2 z-50 md:hidden ${className || ''}`}>
      {/* Navigation links */}
      <div className="flex justify-between w-full">
        {/* Dashboard navigation link */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${activeTab === 'dashboard'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="text-[10px] mt-1">Dashboard</span>
        </Link>

        {/* Products navigation link */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${activeTab === 'products'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[10px] mt-1">Products</span>
        </Link>

        {/* Orders navigation link */}
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${activeTab === 'orders'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-[10px] mt-1">Orders</span>
        </Link>

        {/* Admins navigation link */}
        <Link
          href="/admins"
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${activeTab === 'admins'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-[10px] mt-1">Admins</span>
        </Link>

        {/* Profile navigation link */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${activeTab === 'profile'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300'
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-[10px] mt-1">Profile</span>
        </Link>

        {/* Logout navigation link */}
        <button
          onClick={logout}
          className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors text-red-400 ${activeTab === 'logout'
            ? 'bg-gray-900 text-red-300'
            : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-[10px] mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
}
