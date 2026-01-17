import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import './globals.css';
import { ConvexClientProvider } from '@/components/providers/convex-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { env } from '@/lib/env';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'A full-stack application built with Next.js, Convex, and WorkOS AuthKit.',
  keywords: ['Next.js', 'React', 'Convex', 'WorkOS', 'Authentication'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  icons: {
    icon: '/convex.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'My App',
    title: 'My App',
    description: 'A full-stack application built with Next.js, Convex, and WorkOS AuthKit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'A full-stack application built with Next.js, Convex, and WorkOS AuthKit.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ''}
          customDomain={env.NEXT_PUBLIC_PLAUSIBLE_HOST}
          selfHosted={!!env.NEXT_PUBLIC_PLAUSIBLE_HOST}
          trackOutboundLinks
          enabled={!!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
