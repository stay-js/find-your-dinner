import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/saved',
  title: 'Elmentett recepteim - Find Your Dinner.',
  description: 'Elmentett recepteim - Find Your Dinner.',
  noIndex: true,
});

export default async function SavedRecipesPage() {
  return (
    <div>
      <h1>Elmentett recepteim</h1>
    </div>
  );
}
