import { auth } from '@clerk/nextjs/server';

import { DashboardBreadcrumb } from '~/components/dashboard-breadcrumb';
import { DashboardSidebar } from '~/components/dashboard-sidebar';
import { Footer } from '~/components/footer';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { RecipeTitleProvider } from '~/contexts/recipe-title-context';
import { checkIsAdmin } from '~/server/utils/check-is-admin';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) redirectToSignIn();

  const isAdmin = await checkIsAdmin(userId);

  return (
    <RecipeTitleProvider>
      <SidebarProvider>
        <DashboardSidebar isAdmin={isAdmin} />

        <SidebarInset>
          <header className="bg-background fixed top-0 z-10 flex h-16 w-full items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <SidebarTrigger />

            <Separator className="data-[orientation=vertical]:h-4" orientation="vertical" />

            <DashboardBreadcrumb />
          </header>

          <div className="h-full min-h-[85vh] scroll-mt-22 pt-22 pb-12">{children}</div>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </RecipeTitleProvider>
  );
}
