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

type UserDropdownProps = {
  location: 'left' | 'right';
  onClose?: () => void;
};

export function UserDropdown({ location, onClose }: UserDropdownProps) {
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
          <button
            className="flex items-center gap-2"
            onClick={() => {
              onClose?.();
              openUserProfile();
            }}
          >
            <Settings />
            <span>Fiók kezelése</span>
          </button>
        </DropdownMenuItem>

        {!pathname.startsWith('/dashboard') && (
          <DropdownMenuItem asChild className="w-full">
            <Link className="flex items-center gap-2" href="/dashboard">
              <PanelsTopLeft />
              <span>Irányítópult</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className="w-full">
          <button
            className="flex items-center gap-2"
            onClick={() => {
              onClose?.();
              signOut({ redirectUrl: '/' });
            }}
          >
            <LogOut />
            <span>Kijelentkezés</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
