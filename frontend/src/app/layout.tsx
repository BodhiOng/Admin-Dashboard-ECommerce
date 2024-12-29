'use client';

import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import SidebarVertical from './components/SidebarVertical';
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
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar();

  // Determine sidebar width based on minimized state
  const sidebarWidth = isMinimized ? '5rem' : '16rem';

  return (
    <div 
      className="flex h-full" 
      style={{ 
        '--sidebar-width': sidebarWidth 
      } as React.CSSProperties}
    >
      <div className="fixed inset-y-0 z-50">
        <SidebarVertical className="hidden md:block" />
      </div>
      <main 
        className={`
          flex-1 
          p-6 
          transition-all 
          duration-300 
          w-full 
          md:ml-[var(--sidebar-width)] 
          md:w-[calc(100%-var(--sidebar-width))]
        `}
      >
        {children}
        <AttributionPopup />
      </main>
    </div>
  );
}