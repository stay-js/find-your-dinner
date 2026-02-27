import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/units/manage',

  description: 'Mértékegységek kezelése - Admin',
  title: 'Mértékegységek kezelése - Admin',

  noIndex: true,
});

export default async function AdminManageUnitsPage() {
  return (
    <div className="container flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-semibold">Mértékegységek kezelése</h1>
    </div>
  );
}
