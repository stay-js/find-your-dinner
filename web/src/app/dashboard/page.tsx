import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard',
  title: 'Recepteim - Find Your Dinner.',
  description: 'Recepteim - Find Your Dinner.',
});

export default async function DashboardPage() {
  return (
    <div>
      <h1>Recepteim</h1>
    </div>
  );
}
