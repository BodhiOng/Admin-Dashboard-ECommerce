import Sidebar from './components/Sidebar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='bg-gray-200 min-h-screen' suppressHydrationWarning>
        <div className='flex min-h-screen'>
          <div className='fixed inset-y-0'>
            <Sidebar />
          </div>
          <main className='flex-1 ml-64 p-8 bg-gray-200'>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}