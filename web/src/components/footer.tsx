import { Github, Globe, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '~/components/logo';
import { ThemeSwitcher } from '~/components/theme-switcher';
import { Separator } from '~/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-card border-t text-sm">
      <div className="container mx-auto flex flex-col gap-8 py-12">
        <div className="flex justify-between gap-8 max-md:flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Logo />
                <h3 className="text-lg font-semibold">Find Your Dinner.</h3>
              </div>

              <p className="text-muted-foreground max-w-[50ch] leading-relaxed text-pretty">
                Fedezd fel, mentsd el és oszd meg kedvenc receptjeidet. A gyors hétköznapi
                vacsoráktól a különleges hétvégi lakomákig.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground w-fit font-medium" htmlFor="theme">
                Megjelenés
              </label>

              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex gap-12 max-md:flex-col max-md:gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold">Receptek</h4>

              <div className="flex flex-col gap-2">
                {[
                  {
                    href: '/#felfedezes',
                    title: 'Felfedezés',
                  },
                  {
                    href: '/receptek',
                    title: 'Összes Recept',
                  },
                  {
                    href: '/kategoriak',
                    title: 'Kategóriák',
                  },
                  {
                    href: '/dashboard/recipes/saved',
                    title: 'Mentett Receptek',
                  },
                ].map((item) => (
                  <Link
                    className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors hover:underline"
                    href={item.href}
                    key={item.href}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold">Kapcsolat</h4>

              <div className="flex flex-col gap-2">
                {[
                  {
                    external: true,
                    href: 'https://github.com/stay-js/find-your-dinner',
                    icon: Github,
                    title: 'GitHub',
                  },
                  {
                    external: true,
                    href: 'https://znagy.hu',
                    icon: Globe,
                    title: 'znagy.hu',
                  },
                  {
                    href: '/dashboard/recipes/create',
                    icon: UtensilsCrossed,
                    title: 'Recept létrehozása',
                  },
                ].map((item) => (
                  <Link
                    href={item.href}
                    key={item.href}
                    {...(item.external && {
                      rel: 'noopener noreferrer',
                      target: '_blank',
                    })}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 underline-offset-4 transition-colors hover:underline"
                  >
                    <item.icon className="size-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-muted-foreground flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p>&copy; 2026 - Find Your Dinner. Minden jog fenntartva.</p>

          <Link
            className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors hover:underline"
            href="/adatkezelesi-tajekoztato"
          >
            Adatkezelési tájékoztató
          </Link>
        </div>
      </div>
    </footer>
  );
}
