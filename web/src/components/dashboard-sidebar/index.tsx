import { ShieldCheck, Notebook, Globe } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar';
import { SidebarUser } from './sidebar-user';
import { SidebarNavigation } from './sidebar-navigation';

export function DashboardSidebar({
  isAdmin,
  ...props
}: { isAdmin: boolean } & React.ComponentProps<typeof Sidebar>) {
  const navItems = [
    {
      label: 'Admin',
      visible: isAdmin,
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
