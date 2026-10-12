import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sportz - Match Centre',
  description: 'Real-time match updates and commentary',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
