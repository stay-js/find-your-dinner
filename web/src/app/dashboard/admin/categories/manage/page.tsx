import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/categories/manage',

  description: 'Kategóriák kezelése - Admin',
  title: 'Kategóriák kezelése - Admin',

  noIndex: true,
});

export default async function AdminManageCategoriesPage() {
  return (
    <div className="container flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-semibold">Kategóriák kezelése</h1>
    </div>
  );
}
