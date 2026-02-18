import { Globe, Notebook, ShieldCheck } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar';

import { SidebarNavigation } from './sidebar-navigation';
import { SidebarUser } from './sidebar-user';

type DashboardSidebarProps = {
  isAdmin: boolean;
} & React.ComponentProps<typeof Sidebar>;

export function DashboardSidebar({ isAdmin, ...props }: DashboardSidebarProps) {
  const navItems = [
    {
      items: [
        {
          icon: ShieldCheck,
          isActive: true,
          items: [
            {
              title: 'Receptek jóváhagyása',
              url: '/dashboard/admin/recipes/awaiting-verification',
            },
            {
              title: 'Receptek kezelése',
              url: '/dashboard/admin/recipes/manage',
            },
          ],
          title: 'Receptek kezelése',
        },
      ],
      label: 'Admin',
      visible: isAdmin,
    },
    {
      items: [
        {
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
          title: 'Recepteim',
        },
        {
          icon: Globe,
          isActive: true,
          items: [
            {
              title: 'Mentett receptek',
              url: '/dashboard/recipes/saved',
            },
          ],
          title: 'Felfedezés',
        },
      ],
      label: 'Receptek',
      visible: true,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        {navItems
          .filter((group) => group.visible)
          .map((group) => (
            <SidebarNavigation items={group.items} key={group.label} label={group.label} />
          ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
