'use client';

import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import SidebarVertical from './components/SidebarVertical';
import SidebarHorizontal from './components/SidebarHorizontal';
import AttributionPopup from './components/AttributionPopup';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) return null;

  return (
    <html lang="en">
      <body className="bg-gray-200 min-h-screen overflow-x-hidden">
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  // Determine sidebar width based on minimized state
  const sidebarWidth = isMinimized ? '5rem' : '16rem';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex h-screen">
      {/* Vertical Sidebar for desktop */}
      <div className="hidden md:block fixed-sidebar z-50">
        <SidebarVertical />
      </div>
      
      {/* Main content area with scrolling */}
      <main 
        className={`
          flex-1 
          overflow-y-auto 
          transition-all 
          duration-300 
          relative
          pb-20 md:pb-6
        `}
        style={{ 
          '--sidebar-width': sidebarWidth,
          maxHeight: 'calc(100vh - 0px)'
        } as React.CSSProperties}
      >
        <div className="p-6">
          {children}
          <AttributionPopup />
        </div>
      </main>

      {/* Horizontal Sidebar for mobile */}
      <SidebarHorizontal className="md:hidden fixed bottom-0 left-0 w-full z-50" />
    </div>
  );
}