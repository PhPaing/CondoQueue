import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-noto-thai',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CondoQueue — Bangkok Condo Lifecycle Manager',
  description:
    'Track repairs, bills, and common fees for your Bangkok condo. Built with React + .NET 8 architecture.',
  openGraph: {
    title: 'CondoQueue — Bangkok Condo Lifecycle Manager',
    description: 'Track repairs, bills, and common fees for your Bangkok condo.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${notoThai.variable} font-sans antialiased`}
        style={{ backgroundColor: '#0F172A' }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
