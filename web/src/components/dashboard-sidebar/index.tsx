'use client';

import { ShieldCheck, Notebook, Globe } from 'lucide-react';

import { useIsAdmin } from '~/hooks/use-is-admin';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { SidebarNavigation } from './sidebar-navigation';

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useIsAdmin();

  const adminNavItems = [
    {
      label: 'Admin',
      visible: true,
      items: [
        {
          title: 'Receptek kezelése',
          icon: ShieldCheck,
          isActive: true,
          items: [
            {
              title: 'Receptek jóváhagyása',
              url: '/dashboard/admin/recipes/approve',
            },
            {
              title: 'Receptek kezelése',
              url: '/dashboard/admin/recipes/manage',
            },
          ],
        },
      ],
    },
  ];

  const publicNavItems = [
    {
      label: 'Receptek',
      visible: true,
      items: [
        {
          title: 'Recepteim',
          icon: Notebook,
          isActive: true,
          items: [
            {
              title: 'Recept létrehozása',
              url: '/dashboard/recipes/create',
            },
            {
              title: 'Recepteim kezelése',
              url: '/dashboard/recipes/manage',
            },
          ],
        },
        {
          title: 'Felfedezés',
          icon: Globe,
          isActive: true,
          items: [
            {
              title: 'Mentett receptek',
              url: '/dashboard/recipes/saved',
            },
          ],
        },
      ],
    },
  ];

  const navItems = isAdmin ? adminNavItems.concat(publicNavItems) : publicNavItems;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        {navItems
          .filter((group) => group.visible)
          .map((group) => (
            <SidebarNavigation key={group.label} items={group.items} label={group.label} />
          ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
