import '~/styles/globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { GeistSans } from 'geist/font/sans';
import  { type Viewport } from 'next';
import { ThemeProvider } from 'next-themes';

import { ReactQueryProvider } from '~/app/react-query-provider';
import { Toaster } from '~/components/ui/sonner';

export const viewport: Viewport = {
  colorScheme: 'dark light',
  initialScale: 1,
  width: 'device-width',
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
      <html className={`${GeistSans.variable} scroll-smooth`} lang="hu" suppressHydrationWarning>
        <body className="overflow-x-hidden antialiased">
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableColorScheme
              storageKey="theme"
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
