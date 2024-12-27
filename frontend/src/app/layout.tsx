'use client';

import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import AttributionPopup from './components/AttributionPopup';
import './globals.css';
import { usePathname } from 'next/navigation';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar();
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');

  // If it's a login page, use full width without sidebar margins
  if (isLoginPage) {
    return (
      <main 
        className={`
          flex-1 
          w-full 
          h-full
        `}
      >
        {children}
      </main>
    )
  }

  // Regular layout with sidebar margins
  return (
    <main 
      className={`
        flex-1 
        transition-all 
        duration-300 
        p-8 
        bg-gray-200 
        ${isMinimized ? 'ml-20 w-[calc(100%-5rem)]' : 'ml-64 w-[calc(100%-16rem)]'}
      `}
    >
      {children}
      <AttributionPopup />
    </main>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');

  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`
          ${isLoginPage ? 'bg-white' : 'bg-gray-200'} 
          min-h-screen 
          h-screen 
          overflow-hidden
        `} 
        suppressHydrationWarning
      >
        <SidebarProvider>
          <div className='flex h-full'>
            {!isLoginPage && (
              <div className='fixed inset-y-0'>
                <Sidebar />
              </div>
            )}
            <MainContent>
              {children}
            </MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}