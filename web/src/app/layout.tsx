import '~/styles/globals.css';

import type { Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { GeistSans } from 'geist/font/sans';

export const viewport: Viewport = {
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: shadcn }}>
      <html lang="hu" className={`${GeistSans.variable} dark`}>
        <body>
          <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
            <div className="min-h-screen">{children}</div>

            {/* <Footer /> */}
          </div>

          {/* <Toaster /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
