'use client';

import DesktopNavbar from './DesktopNavigationBar';
import MobileNavbar from './MobileNavigationBar';
import AttributionPopup from './AttributionPopup';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../contexts/SidebarContext';
import { useMemo, useState, useEffect } from 'react';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { isMinimized } = useSidebar();
  
  const isFullscreenPage = useMemo(() => 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/pending-approval') ||
    pathname.startsWith('/forgot-password'), 
    [pathname]
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (isFullscreenPage) {
    return (
      <div className="h-screen w-screen absolute inset-0 flex items-center justify-center">
        {children}
        <AttributionPopup />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-gray-200">
      {/* Desktop Navigation */}
      <aside className={`
        hidden md:block fixed top-0 left-0 h-full bg-white shadow-lg
        transition-all duration-300 ease-in-out z-40
        ${isMinimized ? 'w-20' : 'w-64'}
      `}>
        <DesktopNavbar />
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isMinimized ? 'md:ml-20' : 'md:ml-64'}
        p-6 pb-24 md:pb-6 overflow-x-auto
      `}>
        {children}
        <AttributionPopup />
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg z-40">
        <MobileNavbar />
      </nav>

      {/* Tablet Navigation */}
      <nav className="hidden md:block lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg z-40">
        <MobileNavbar />
      </nav>
    </div>
  );
}
