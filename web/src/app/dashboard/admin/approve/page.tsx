import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/approve',
  title: 'Receptek jóváhagyása - Admin - Find Your Dinner.',
  description: 'Receptek jóváhagyása - Admin - Find Your Dinner.',
  noIndex: true,
});

export default async function AdminApprovePage() {
  return (
    <div>
      <h1>Admin - Receptek jóváhagyása</h1>
    </div>
  );
}
