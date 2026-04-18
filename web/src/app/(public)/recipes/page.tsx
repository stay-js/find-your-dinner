import { createMetadata } from '~/lib/create-metadata';

import { Recipes } from './recipes';

export const metadata = createMetadata({
  path: '/recipes',

  description:
    'Böngéssz recepteink között és találd meg a számodra legmegfelelőbbet. Szűrj kategóriák, és hozzávalók szerint. Mentsd el a kedvenceidet.',
  title: 'Receptek',
});

export default async function PublicRecipesPage() {
  return (
    <div className="container flex h-full flex-col gap-4 pt-6">
      <h1 className="text-foreground text-2xl font-semibold">Receptek</h1>

      <Recipes />
    </div>
  );
}
