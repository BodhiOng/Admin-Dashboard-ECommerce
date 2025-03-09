import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Modern Admin Dashboard for E-Commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SidebarProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}