'use client';

import React from 'react';
import Link from 'next/link';

export default function AttributionPopup() {
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden md:block">
      <div className="bg-gray-800/50 backdrop-blur-sm text-white/70 px-3 py-2 rounded-md text-xs tracking-wider transition-all duration-300 hover:bg-gray-800/70 hover:text-white">
        Made by{' '}
        <Link
          href="https://github.com/BodhiOng"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/90 transition-colors"
        >
          @BodhiOng
        </Link>
      </div>
    </div>
  );
}
