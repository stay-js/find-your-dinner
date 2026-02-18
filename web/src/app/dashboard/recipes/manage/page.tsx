import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { createMetadata } from '~/lib/create-metadata';

import { Recipes } from './recipes';

export const metadata = createMetadata({
  path: '/dashboard/recipes/manage',

  description: 'Recepteim kezelése',
  title: 'Recepteim kezelése',

  noIndex: true,
});

export default async function ManagePage() {
  return (
    <div className="container flex h-full flex-col gap-4 px-0">
      <div className="flex justify-between gap-4 max-sm:flex-col">
        <h1 className="text-foreground text-2xl font-semibold">Recepteim kezelése</h1>

        <Button asChild>
          <Link href="/dashboard/recipes/create">
            <Plus className="size-4" />
            <span>Új recept létrehozása</span>
          </Link>
        </Button>
      </div>

      <Recipes />
    </div>
  );
}
