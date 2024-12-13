"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[1] || 'dashboard';

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white p-5 flex flex-col">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://eu.ui-avatars.com/api/?name=Bodhi+Ong&size=250"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <span className="font-medium">@bodhiong</span>
        <span className="text-sm text-gray-300">Bodhidharma Ong</span>
      </div>

      <div className="flex-1 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/products"
          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            activeTab === 'products'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Products</span>
        </Link>

        <Link
          href="/orders"
          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Orders</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <button className="p-2 rounded-lg border border-gray-400 hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2">
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
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </button>
        <button className="p-2 rounded-lg border border-red-400 text-red-400 hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2">
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
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
