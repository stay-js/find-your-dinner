import { currentUser } from '@clerk/nextjs/server';
import {
  ArrowRight,
  Bookmark,
  Clipboard,
  FlaskConical,
  Globe,
  NotebookPen,
  PlusCircle,
  Ruler,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { createMetadata } from '~/lib/create-metadata';
import { checkIsAdmin } from '~/server/utils/check-is-admin';

export const metadata = createMetadata({
  path: '/dashboard',

  description: 'Irányítópult',
  title: 'Irányítópult',

  noIndex: true,
});

type QuickLinkCardProps = {
  description: string;
  href: string;
  icon: React.ReactNode;
  title: string;
};

export default async function DashboardPage() {
  const user = await currentUser();
  const isAdmin = await checkIsAdmin(user?.id);

  return (
    <div className="container flex flex-col gap-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Üdvözöllek, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Az irányítópulton elérheted a saját recepteidet, az elmentett recepteidet, illetve
          létrehozhatsz új recepteket.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {isAdmin && (
          <section className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span className="text-xl font-semibold">Admin</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  description: 'Jóváhagyásra váró receptek kezelése',
                  href: '/dashboard/admin/recipes?only-awaiting-verification=true',
                  icon: ShieldCheck,
                  title: 'Jóváhagyásra váró receptek',
                },
                {
                  description: 'Összes recept kezelése, szerkesztése',
                  href: '/dashboard/admin/recipes',
                  icon: Clipboard,
                  title: 'Receptek kezelése',
                },
                {
                  description: 'Kategóriák kezelése, szerkesztése',
                  href: '/dashboard/admin/categories',
                  icon: Tag,
                  title: 'Kategóriák kezelése',
                },
                {
                  description: 'Hozzávalók kezelése, szerkesztése',
                  href: '/dashboard/admin/ingredients',
                  icon: FlaskConical,
                  title: 'Hozzávalók kezelése',
                },
                {
                  description: 'Mértékegységek kezelése, szerkesztése',
                  href: '/dashboard/admin/units',
                  icon: Ruler,
                  title: 'Mértékegységek kezelése',
                },
              ].map((item) => (
                <QuickLinkCard
                  description={item.description}
                  href={item.href}
                  icon={<item.icon className="size-5 text-emerald-600" />}
                  key={item.href}
                  title={item.title}
                />
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2">
            <NotebookPen className="size-5 text-amber-600" />
            <span className="text-xl font-semibold">Recepteim</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                description: 'Új recept létrehozása',
                href: '/dashboard/recipes/create',
                icon: PlusCircle,
                title: 'Recept létrehozása',
              },
              {
                description: 'Saját receptek kezelése, szerkesztése',
                href: '/dashboard/recipes',
                icon: NotebookPen,
                title: 'Recepteim kezelése',
              },
            ].map((item) => (
              <QuickLinkCard
                description={item.description}
                href={item.href}
                icon={<item.icon className="size-5 text-amber-600" />}
                key={item.href}
                title={item.title}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2">
            <Globe className="size-5 text-sky-600" />
            <span className="text-xl font-semibold">Felfedezés</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLinkCard
              description="Mentett receptek megtekintése"
              href="/dashboard/recipes/saved"
              icon={<Bookmark className="size-5 text-sky-600" />}
              title="Mentett recepteim"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickLinkCard({ description, href, icon, title }: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full">
        <CardHeader className="flex items-center gap-3">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 items-end justify-between gap-4">
          <CardDescription>{description}</CardDescription>
          <ArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
