import { EditPage } from '~/app/_edit-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/edit',
  title: 'Recept szerkesztése',
  description: 'Recept szerkesztése - Find Your Dinner.',
  noIndex: true,
});

export default EditPage;
