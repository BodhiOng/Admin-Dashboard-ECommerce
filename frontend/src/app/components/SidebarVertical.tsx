"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from '../contexts/SidebarContext';

// Sidebar component for navigation in the admin dashboard
export default function SidebarVertical({ className = '' }: { className?: string }) {
  // Get the current pathname to determine active navigation item
  const pathname = usePathname();

  // Extracts the first path segment or defaults to 'dashboard'
  // This helps highlight the current active navigation item
  const activeTab = pathname.split('/')[1] || 'dashboard';

  const { isMinimized, toggleSidebar } = useSidebar();

  return (
    // Full-height sidebar with dark background and flexible layout
    <aside className={`h-screen bg-gray-800 text-white p-5 flex flex-col transition-all duration-300 
      ${isMinimized ? 'w-20' : 'w-64'} relative ${className}`}>
      {/* Hamburger toggle button */}
      <button
        onClick={toggleSidebar}
        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-white hover:text-gray-300 ${
          isMinimized ? 'justify-center w-full' : 'justify-start'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMinimized ? (
            // Hamburger icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          ) : (
            // Close icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        {!isMinimized && <span>Menu</span>}
      </button>

      {/* User profile section */}
      <div className={`flex flex-col items-center my-8 ${isMinimized ? 'hidden' : ''}`}>
        <img
          src="https://eu.ui-avatars.com/api/?name=Bodhi+Ong&size=250"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <span className="font-medium">@bodhiong</span>
        <span className="text-sm text-gray-300">Bodhi Ong</span>
      </div>

      {/* Navigation links */}
      <div className={`flex flex-col ${isMinimized ? 'items-center' : 'items-start'} space-y-4 mt-12 h-full`}>
        {/* Dashboard navigation link */}
        <Link
          href="/dashboard"
          className={`flex items-center w-full space-x-3 p-2 rounded-lg transition-colors ${activeTab === 'dashboard'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          {!isMinimized && <span>Dashboard</span>}
        </Link>

        {/* Products navigation link */}
        <Link
          href="/products"
          className={`flex items-center w-full space-x-3 p-2 rounded-lg transition-colors ${activeTab === 'products'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {!isMinimized && <span>Products</span>}
        </Link>

        {/* Orders navigation link */}
        <Link
          href="/orders"
          className={`flex items-center w-full space-x-3 p-2 rounded-lg transition-colors ${activeTab === 'orders'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {!isMinimized && <span>Orders</span>}
        </Link>

        {/* Admins navigation link */}
        <Link
          href="/admins"
          className={`flex items-center w-full space-x-3 p-2 rounded-lg transition-colors ${activeTab === 'admins'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {!isMinimized && <span>Admins</span>}
        </Link>
      </div>

      {/* User actions section */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className={`flex flex-col gap-3 ${isMinimized ? 'items-center' : ''}`}>
          {/* Profile button */}
          <Link 
            href="/profile"
            className={`p-2 rounded-lg border border-gray-400 hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 ${isMinimized ? 'w-full' : ''}`}
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
            {!isMinimized && <span>Profile</span>}
          </Link>

          {/* Logout button */}
          <Link 
            href="/login"
            className={`p-2 rounded-lg border border-red-400 text-red-400 hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2 ${isMinimized ? 'w-full' : ''}`}
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
            {!isMinimized && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
