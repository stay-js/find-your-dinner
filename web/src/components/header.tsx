'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useSession } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { UserAvatar } from '~/components/user';
import { UserDropdown } from '~/components/user-dropdown';

export function Header() {
  const { isLoaded, isSignedIn } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background fixed top-0 z-10 w-full border-b">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <Link className="flex items-center gap-2" href="/">
          <Logo size={36} />

          <span className="text-primary text-base font-semibold underline-offset-4 hover:underline">
            Find Your Dinner.
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Button asChild className="px-0" size="sm" variant="link">
            <Link href="/find">Keresés</Link>
          </Button>

          <Button asChild className="px-0" size="sm" variant="link">
            <Link href="/recipes">Összes recept</Link>
          </Button>

          {isLoaded &&
            (isSignedIn ? (
              <>
                <Button asChild className="px-0" size="sm" variant="link">
                  <Link href="/dashboard/recipes">Irányítópult</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <UserAvatar className="size-7" />
                    </Button>
                  </DropdownMenuTrigger>

                  <UserDropdown location="right" />
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <Button size="sm">Bejelentkezés</Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button size="sm" variant="outline">
                    Regisztráció
                  </Button>
                </SignUpButton>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <UserAvatar className="size-7" />
                </Button>
              </DropdownMenuTrigger>

              <UserDropdown location="right" />
            </DropdownMenu>
          )}

          <Button onClick={() => setIsMobileMenuOpen((val) => !val)} size="icon" variant="ghost">
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="flex flex-col items-start gap-2 border-t p-4 md:hidden">
          <Button
            asChild
            className="px-0"
            onClick={() => setIsMobileMenuOpen(false)}
            size="sm"
            variant="link"
          >
            <Link href="/find">Keresés</Link>
          </Button>

          <Button
            asChild
            className="px-0"
            onClick={() => setIsMobileMenuOpen(false)}
            size="sm"
            variant="link"
          >
            <Link href="/recipes">Összes recept</Link>
          </Button>

          {isLoaded &&
            (isSignedIn ? (
              <>
                <Button
                  asChild
                  className="px-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                  size="sm"
                  variant="link"
                >
                  <Link href="/dashboard/recipes">Irányítópult</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex gap-2 py-2">
                  <SignInButton mode="modal">
                    <Button onClick={() => setIsMobileMenuOpen(false)} size="sm">
                      Bejelentkezés
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button onClick={() => setIsMobileMenuOpen(false)} size="sm" variant="outline">
                      Regisztráció
                    </Button>
                  </SignUpButton>
                </div>
              </>
            ))}
        </nav>
      )}
    </header>
  );
}
