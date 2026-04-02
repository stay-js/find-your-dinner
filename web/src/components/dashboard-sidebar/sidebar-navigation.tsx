'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '~/components/ui/sidebar';

type Item = {
  icon?: React.ElementType;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  title: string;
};

type SidebarNavigationProps = {
  items: Item[];
  label?: string;
};

export function SidebarNavigation({ items, label }: SidebarNavigationProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Collapsible className="group/collapsible" defaultOpen={item.isActive}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}

                  <span>{item.title}</span>

                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild onClick={() => setOpenMobile(false)}>
                        <Link href={subItem.url}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
