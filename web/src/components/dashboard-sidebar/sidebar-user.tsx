import { ChevronsUpDown } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
import { User } from '~/components/user';
import { UserDropdown } from '~/components/user-dropdown';

export function SidebarUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <User />
              <ChevronsUpDown className="ml-auto" size={16} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <UserDropdown location="left" />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
