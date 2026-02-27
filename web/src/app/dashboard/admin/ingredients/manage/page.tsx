import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/ingredients/manage',

  description: 'Hozzávalók kezelése - Admin',
  title: 'Hozzávalók kezelése - Admin',

  noIndex: true,
});

export default async function AdminManageIngredientsPage() {
  return (
    <div className="container flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-semibold">Hozzávalók kezelése</h1>
    </div>
  );
}
