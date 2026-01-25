import Link from 'next/link';
import { ChefHat, UtensilsCrossed, Github, Globe } from 'lucide-react';

import { ThemeSwitcher } from '~/components/theme-switcher';

export function Footer() {
  return (
    <footer className="bg-card border-t text-sm">
      <div className="container mx-auto flex flex-col gap-8 py-12">
        <div className="flex justify-between gap-8 max-md:flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ChefHat className="text-accent-foreground size-6" />
                <h3 className="text-lg font-semibold">Find Your Dinner.</h3>
              </div>

              <p className="text-muted-foreground max-w-[50ch] leading-relaxed text-pretty">
                Fedezd fel, mentsd el és oszd meg kedvenc receptjeidet. A gyors hétköznapi
                vacsoráktól a különleges hétvégi lakomákig.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="theme" className="text-muted-foreground w-fit font-medium">
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
                    title: 'Felfedezés',
                    href: '/#felfedezes',
                  },
                  {
                    title: 'Összes Recept',
                    href: '/receptek',
                  },
                  {
                    title: 'Kategóriák',
                    href: '/kategoriak',
                  },
                  {
                    title: 'Mentett Receptek',
                    href: '/dashboard/recipes/saved',
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors hover:underline"
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
                    title: 'GitHub',
                    href: 'https://github.com/stay-js/find-your-dinner',
                    external: true,
                    icon: Github,
                  },
                  {
                    title: 'znagy.hu',
                    href: 'https://znagy.hu',
                    external: true,
                    icon: Globe,
                  },
                  {
                    title: 'Recept létrehozása',
                    href: '/dashboard/recipes/create',
                    icon: UtensilsCrossed,
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
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

        <hr />

        <div className="text-muted-foreground flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p>&copy; 2026 - Find Your Dinner. Minden jog fenntartva.</p>

          <Link
            href="/adatkezelesi-tajekoztato"
            className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Adatkezelési tájékoztató
          </Link>
        </div>
      </div>
    </footer>
  );
}
