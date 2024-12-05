"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[1] || 'dashboard';

  return (
    <aside className="w-64 bg-gray-800 text-white p-5 h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://eu.ui-avatars.com/api/?name=Bodhi+Ong&size=250"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <span className="font-medium">@bodhiong</span>
        <span className="text-sm text-gray-300">Bodhidharma Ong</span>
      </div>

      <nav className="flex flex-col gap-2 mb-8">
        {["dashboard", "products", "orders", "analytics"].map((tab) => (
          <Link
            key={tab}
            href={`/${tab}`}
            className={`p-2 rounded-lg text-left ${
              activeTab === tab ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        ))}
      </nav>

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