'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { DefaultIngredientsDialog } from '~/components/default-ingredients-dialog';
import { DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { User } from '~/components/user';
import { UserDropdown } from '~/components/user-dropdown';

export function SidebarUser() {
  const { setOpenMobile } = useSidebar();

  const [isDefaultIngredientsOpen, setIsDefaultIngredientsOpen] = useState(false);

  return (
    <>
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

            <UserDropdown
              location="left"
              onClose={() => setOpenMobile(false)}
              onOpenDefaultIngredients={() => setIsDefaultIngredientsOpen(true)}
            />
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DefaultIngredientsDialog
        onOpenChange={setIsDefaultIngredientsOpen}
        open={isDefaultIngredientsOpen}
      />
    </>
  );
}
