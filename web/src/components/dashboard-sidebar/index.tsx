'use client';

import { Notebook } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { SidebarNavigation } from './sidebar-navigation';

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navItems = [
    {
      label: 'Recepteim',
      visible: true,
      items: [
        {
          title: 'Recepteim',
          icon: Notebook,
          isActive: true,
          items: [
            {
              title: 'Recepteim kezelése',
              url: '/dashboard/my-recipes',
            },
          ],
        },
      ],
    },
  ];

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
