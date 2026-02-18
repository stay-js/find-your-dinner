import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/manage',

  description: 'Receptek kezelése - Admin - Find Your Dinner.',
  title: 'Receptek kezelése - Admin',

  noIndex: true,
});

export default async function AdminManagePage() {
  return (
    <div>
      <h1>Admin - Receptek kezelése</h1>
    </div>
  );
}
