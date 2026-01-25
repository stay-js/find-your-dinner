import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { UserDropdown } from '~/components/user-dropdown';
import { UserAvatar } from '~/components/user';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <Link href="/">
        <Button variant="link" className="p-0 text-base font-semibold">
          Find Your Dinner.
        </Button>
      </Link>

      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <UserAvatar className="size-7" />
            </Button>
          </DropdownMenuTrigger>

          <UserDropdown location="right" />
        </DropdownMenu>
      </SignedIn>

      <SignedOut>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <Button>Bejelentkezés</Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button variant="outline" className="max-md:hidden">
              Regisztráció
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </header>
  );
}
