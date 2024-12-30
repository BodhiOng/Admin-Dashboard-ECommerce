import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import { SidebarProvider } from './contexts/SidebarContext';

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
        <SidebarProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}