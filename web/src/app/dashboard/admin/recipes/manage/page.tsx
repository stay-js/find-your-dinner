import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/manage',
  title: 'Receptek kezelése - Admin',
  description: 'Receptek kezelése - Admin - Find Your Dinner.',
  noIndex: true,
});

export default async function AdminManagePage() {
  return (
    <div>
      <h1>Admin - Receptek kezelése</h1>
    </div>
  );
}
