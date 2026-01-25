import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/create',
  title: 'Recept létrehozása - Find Your Dinner.',
  description: 'Recept létrehozása - Find Your Dinner.',
  noIndex: true,
});

export default async function CreatePage() {
  return (
    <div>
      <h1>Recept létrehozása</h1>
    </div>
  );
}
