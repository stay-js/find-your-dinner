import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { DashboardSidebar } from '~/components/dashboard-sidebar';
import { Footer } from '~/components/footer';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) redirectToSignIn();

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger />

          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />

          <Button variant="link" className="px-2" asChild>
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
        </header>

        <div className="h-full min-h-[75vh] p-6 pb-12">{children}</div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
