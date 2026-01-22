import '~/styles/globals.css';

import type { Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';

import { ReactQueryProvider } from '~/app/react-query-provider';
import { Toaster } from '~/components/ui/sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

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
      <html lang="hu" className={`${GeistSans.variable} scroll-smooth`} suppressHydrationWarning>
        <body className="overflow-x-hidden antialiased">
          <ReactQueryProvider>
            <ThemeProvider
              storageKey="theme"
              defaultTheme="system"
              attribute="class"
              enableColorScheme
              disableTransitionOnChange
            >
              {children}

              <Toaster />
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
