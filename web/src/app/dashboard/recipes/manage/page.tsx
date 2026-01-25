import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/manage',
  title: 'Recepteim kezelése - Find Your Dinner.',
  description: 'Recepteim kezelése - Find Your Dinner.',
  noIndex: true,
});

export default async function ManagePage() {
  return (
    <div>
      <h1>Recepteim kezelése</h1>
    </div>
  );
}
