import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { Logo } from '~/components/logo';
import { UserDropdown } from '~/components/user-dropdown';
import { UserAvatar } from '~/components/user';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b px-4">
      <Link href="/" className="flex items-center gap-2">
        <Logo size={36} />

        <span className="text-primary text-base font-semibold underline-offset-4 hover:underline">
          Find Your Dinner.
        </span>
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
