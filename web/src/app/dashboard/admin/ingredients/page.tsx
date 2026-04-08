import { createMetadata } from '~/lib/create-metadata';

import { Ingredients } from './ingredients';

export const metadata = createMetadata({
  path: '/dashboard/admin/ingredients',

  description: 'Hozzávalók kezelése - Admin',
  title: 'Hozzávalók kezelése - Admin',

  noIndex: true,
});

export default async function DashboardAdminManageIngredientsPage() {
  return (
    <div className="container flex h-full flex-col gap-4">
      <Ingredients />
    </div>
  );
}
