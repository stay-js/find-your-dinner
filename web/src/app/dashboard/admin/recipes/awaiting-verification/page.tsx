import { createMetadata } from '~/lib/create-metadata';

import { Recipes } from './recipes';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/awaiting-verification',

  description: 'Receptek jóváhagyása - Admin',
  title: 'Receptek jóváhagyása - Admin',

  noIndex: true,
});

export default async function AdminAwaitingVerificationPage() {
  return (
    <div className="container flex flex-col gap-4 px-0">
      <h1 className="text-foreground text-2xl font-semibold">Jóváhagyásra váró receptek</h1>

      <Recipes />
    </div>
  );
}
