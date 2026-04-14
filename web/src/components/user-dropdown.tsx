'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut, Settings, UtensilsCrossed } from 'lucide-react';

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
  onOpenDefaultIngredients: () => void;
};

export function UserDropdown({ location, onClose, onOpenDefaultIngredients }: UserDropdownProps) {
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

        <DropdownMenuItem asChild className="w-full">
          <button
            className="flex items-center gap-2"
            onClick={() => {
              onClose?.();
              onOpenDefaultIngredients();
            }}
          >
            <UtensilsCrossed />
            <span>Alapértelmezett hozzávalók</span>
          </button>
        </DropdownMenuItem>

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
