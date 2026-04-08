import { createMetadata } from '~/lib/create-metadata';

import { Units } from './units';

export const metadata = createMetadata({
  path: '/dashboard/admin/units',

  description: 'Mértékegységek kezelése - Admin',
  title: 'Mértékegységek kezelése - Admin',

  noIndex: true,
});

export default async function DashboardAdminManageUnitsPage() {
  return (
    <div className="container flex h-full flex-col gap-4">
      <Units />
    </div>
  );
}
