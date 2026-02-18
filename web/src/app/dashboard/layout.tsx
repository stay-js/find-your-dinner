import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { DashboardSidebar } from '~/components/dashboard-sidebar';
import { Footer } from '~/components/footer';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { checkIsAdmin } from '~/server/utils/check-is-admin';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) redirectToSignIn();

  const isAdmin = await checkIsAdmin(userId);

  return (
    <SidebarProvider>
      <DashboardSidebar isAdmin={isAdmin} />

      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger />

          <Separator className="data-[orientation=vertical]:h-4" orientation="vertical" />

          <Button asChild className="px-2" variant="link">
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
        </header>

        <div className="h-full min-h-[75vh] p-6 pb-12">{children}</div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
