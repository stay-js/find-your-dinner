import { createMetadata } from '~/lib/create-metadata';
import { Recipe } from './recipe';

export const metadata = createMetadata({
  path: '/dashboard/admin/view',
  title: 'Recept megtekintése - Admin',
  description: 'Recept megtekintése - Admin',
  noIndex: true,
});

export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <Recipe recipeId={id} />;
}
