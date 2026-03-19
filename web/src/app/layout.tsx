import '~/styles/globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { type Viewport } from 'next';
import { ThemeProvider } from '~/components/theme-provider';
import { Suspense } from 'react';

import { ReactQueryProvider } from '~/app/react-query-provider';
import { Toaster } from '~/components/ui/sonner';
import { cn } from '~/lib/utils';

export const viewport: Viewport = {
  colorScheme: 'dark light',
  initialScale: 1,
  width: 'device-width',
};

const fontSans = Geist({
  subsets: ['latin-ext'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin-ext'],
  variable: '--font-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
        elements: {
          modalBackdrop: 'bg-black/30',
        },
      }}
    >
      <html
        className={cn('antialiased', fontMono.variable, 'font-sans', fontSans.variable)}
        lang="hu"
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <body className="overflow-x-hidden antialiased">
          <ThemeProvider>
            <ReactQueryProvider>
              <Suspense>{children}</Suspense>

              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
