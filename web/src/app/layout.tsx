import '~/styles/globals.css';

import type { Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';

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
          <ThemeProvider
            storageKey="theme"
            defaultTheme="dark"
            attribute="class"
            enableColorScheme
            disableTransitionOnChange
          >
            {children}

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
