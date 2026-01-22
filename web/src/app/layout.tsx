import '~/styles/globals.css';

import type { Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';

import { Header } from '~/components/header';
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
            <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
              <div className="min-h-screen">
                <Header />
                {children}
              </div>

              {/* <Footer /> */}
            </div>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
