import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, Space_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Intellect Studio — Internship Portal',
  description: 'Apply for an internship at Intellect Studio. Submit your application and get your temporary employee ID instantly.',
  keywords: ['Intellect Studio', 'internship', 'application', 'portal'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="noise-overlay">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0C0C0A',
              color: '#F5F4EF',
              border: '1px solid #333330',
              borderRadius: '0',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}
