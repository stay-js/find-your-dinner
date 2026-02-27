import { createMetadata } from '~/lib/create-metadata';

import { Recipes } from './recipes';

export const metadata = createMetadata({
  path: '/recipes',

  description: 'Böngéssz recepteink között és találd meg a számodra legmegfelelőbbet.',
  title: 'Receptek',
});

export default async function RecipesPage() {
  return (
    <div className="container flex flex-col gap-6">
      <h1 className="text-foreground text-2xl font-semibold">Receptek</h1>

      <Recipes />
    </div>
  );
}
