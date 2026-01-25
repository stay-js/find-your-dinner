import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/edit',
  title: 'Recept szerkesztése - Find Your Dinner.',
  description: 'Recept szerkesztése - Find Your Dinner.',
  noIndex: true,
});

export default async function EditPage() {
  return (
    <div>
      <h1>Recept szerkesztése</h1>
    </div>
  );
}
