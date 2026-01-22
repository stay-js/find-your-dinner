'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut, Settings } from 'lucide-react';

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
  const isMobile = useIsMobile();
  const { openUserProfile, signOut } = useClerk();

  return (
    <DropdownMenuContent
      className="my-4 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={!isMobile ? 'right' : undefined}
      align={location === 'right' ? 'end' : 'start'}
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0">
        <User />
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="w-full">
          <button onClick={() => openUserProfile()}>
            <Settings />
            <span>Fiók kezelése</span>
          </button>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="w-full">
          <button onClick={() => signOut({ redirectUrl: '/' })} className="flex items-center gap-2">
            <LogOut />
            <span>Kijelentkezés</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
