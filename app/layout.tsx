import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletsProvider } from '@/providers/WalletsProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crossmint Wallets API Demo',
  description: 'Demo application for the Crossmint Wallets API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletsProvider>{children}</WalletsProvider>
        <Toaster />
      </body>
    </html>
  );
}
