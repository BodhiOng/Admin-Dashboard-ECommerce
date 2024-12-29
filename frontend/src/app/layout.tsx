'use client';

import { SidebarProvider } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import AttributionPopup from './components/AttributionPopup';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isFullscreenPage = useMemo(() => 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/pendingapproval'), 
    [pathname]
  );

  if (isFullscreenPage) {
    return (
      <html lang="en">
        <body className="login-layout">
          <div className="h-screen w-screen absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-200 min-h-screen h-screen overflow-y-auto">
        <SidebarProvider>
          <div className="flex h-full">
            <div className="fixed inset-y-0 z-50">
              <Sidebar />
            </div>
            <main 
              className="
                flex-1 
                transition-all 
                duration-300 
                p-8 
                bg-gray-200 
                ml-64 
                w-[calc(100%-16rem)]
              "
            >
              {children}
              <AttributionPopup />
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}