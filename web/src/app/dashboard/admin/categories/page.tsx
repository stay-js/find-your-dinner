import { createMetadata } from '~/lib/create-metadata';

import { Categories } from './categories';

export const metadata = createMetadata({
  path: '/dashboard/admin/categories',

  description: 'Kategóriák kezelése - Admin',
  title: 'Kategóriák kezelése - Admin',

  noIndex: true,
});

export default async function DashboardAdminManageCategoriesPage() {
  return (
    <div className="container flex h-full flex-col gap-4">
      <Categories />
    </div>
  );
}
