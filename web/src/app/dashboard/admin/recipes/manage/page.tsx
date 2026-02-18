import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/manage',

  description: 'Receptek kezelése - Admin',
  title: 'Receptek kezelése - Admin',

  noIndex: true,
});

export default async function AdminManagePage() {
  return (
    <div className="container flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-semibold">Receptek kezelése</h1>
    </div>
  );
}
