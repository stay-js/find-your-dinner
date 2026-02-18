import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard',

  description: 'Recepteim',
  title: 'Recepteim',
});

export default async function DashboardPage() {
  return (
    <div>
      <h1>Recepteim</h1>
    </div>
  );
}
