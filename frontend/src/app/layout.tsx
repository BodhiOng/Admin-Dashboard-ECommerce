import Sidebar from './components/Sidebar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='bg-gray-200' suppressHydrationWarning>
        <div className='flex h-screen'>
          <Sidebar />
          <main className='flex-1 p-8 bg-gray-200'>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}