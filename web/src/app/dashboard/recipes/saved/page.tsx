import { createMetadata } from '~/lib/create-metadata';

import { SavedRecipes } from './saved-recipes';

export const metadata = createMetadata({
  path: '/dashboard/recipes/saved',

  description: 'Mentett receptek',
  title: 'Mentett receptek',

  noIndex: true,
});

export default async function SavedRecipesPage() {
  return (
    <div className="container flex h-full flex-col gap-4 px-0">
      <h1 className="text-foreground text-2xl font-semibold">Mentett receptek</h1>

      <SavedRecipes />
    </div>
  );
}
