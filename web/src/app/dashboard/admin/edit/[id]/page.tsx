import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/edit',
  title: 'Recept szerkesztése - Admin - Find Your Dinner.',
  description: 'Recept szerkesztése - Admin - Find Your Dinner.',
  noIndex: true,
});

export default async function AdminEditPage() {
  return (
    <div>
      <h1>Admin - Recept szerkesztése</h1>
    </div>
  );
}
