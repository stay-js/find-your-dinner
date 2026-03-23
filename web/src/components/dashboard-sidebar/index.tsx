import { Globe, Notebook, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '~/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';

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
              title: 'Receptek kezelése',
              url: '/dashboard/admin/recipes',
            },
            {
              title: 'Kategóriák kezelése',
              url: '/dashboard/admin/categories',
            },
            {
              title: 'Hozzávalók kezelése',
              url: '/dashboard/admin/ingredients',
            },
            {
              title: 'Mértékegységek kezelése',
              url: '/dashboard/admin/units',
            },
          ],
          title: 'Adminisztráció',
        },
      ],
      label: 'Adminisztráció',
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
              url: '/dashboard/recipes',
            },
          ],
          title: 'Recepteim',
        },
        {
          icon: Globe,
          isActive: true,
          items: [
            {
              title: 'Mentett recepteim',
              url: '/dashboard/recipes/saved',
            },
          ],
          title: 'Felfedezés',
        },
      ],
      label: 'Recepteim',
      visible: true,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex h-16 justify-center border-b px-4">
        <Link className="flex items-center gap-2" href="/">
          <Logo size={36} />

          <span className="text-primary text-base font-semibold underline-offset-4 hover:underline">
            Find Your Dinner.
          </span>
        </Link>
      </SidebarHeader>

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
