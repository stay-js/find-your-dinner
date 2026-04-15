import '~/styles/globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/ui/themes';
import { type Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';

import { ReactQueryProvider } from '~/app/react-query-provider';
import { DefaultIngredientsDialogProvider } from '~/components/default-ingredients-dialog-context';
import { ThemeProvider } from '~/components/theme-provider';
import { Toaster } from '~/components/ui/sonner';
import { TooltipProvider } from '~/components/ui/tooltip';
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
        elements: {
          checkbox: 'dark:bg-input/30!',
          input: 'bg-input/30! text-xs!',
        },
        theme: shadcn,
      }}
    >
      <html
        className={cn(fontMono.variable, 'font-sans', fontSans.variable)}
        data-scroll-behavior="smooth"
        lang="hu"
        suppressHydrationWarning
      >
        <body className="overflow-x-hidden antialiased">
          <ThemeProvider>
            <TooltipProvider>
              <ReactQueryProvider>
                <DefaultIngredientsDialogProvider>
                  <Suspense>{children}</Suspense>

                  <Toaster />
                </DefaultIngredientsDialogProvider>
              </ReactQueryProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
