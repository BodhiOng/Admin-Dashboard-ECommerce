'use client'

import Sidebar from './components/Sidebar'
import AttributionPopup from './components/AttributionPopup'
import './globals.css'
import { SidebarProvider, useSidebar } from './contexts/SidebarContext'

function MainContent({ children }: { children: React.ReactNode }) {
  const { isMinimized } = useSidebar()

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='bg-gray-200 min-h-screen' suppressHydrationWarning>
        <SidebarProvider>
          <div className='flex min-h-screen'>
            <div className='fixed inset-y-0'>
              <Sidebar />
            </div>
            <MainContent>
              {children}
            </MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}