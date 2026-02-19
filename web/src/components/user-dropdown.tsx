'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut, PanelsTopLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';
import { User } from '~/components/user';
import { useIsMobile } from '~/hooks/use-mobile';

export function UserDropdown({ location }: { location: 'left' | 'right' }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { openUserProfile, signOut } = useClerk();

  return (
    <DropdownMenuContent
      align={location === 'right' ? 'end' : 'start'}
      className="my-4 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={!isMobile ? 'right' : undefined}
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0">
        <User />
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="w-full">
          <button className="flex items-center gap-2" onClick={() => openUserProfile()}>
            <Settings />
            <span>Fiók kezelése</span>
          </button>
        </DropdownMenuItem>

        {!pathname.startsWith('/dashboard') && (
          <DropdownMenuItem asChild className="w-full">
            <Link className="flex items-center gap-2" href="/dashboard/recipes/manage">
              <PanelsTopLeft />
              <span>Irányítópult</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className="w-full">
          <button className="flex items-center gap-2" onClick={() => signOut({ redirectUrl: '/' })}>
            <LogOut />
            <span>Kijelentkezés</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
