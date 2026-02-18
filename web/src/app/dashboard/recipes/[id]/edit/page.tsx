import { EditPage } from '~/app/_edit-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/[id]/edit',

  description: 'Recept szerkesztése - Find Your Dinner.',
  title: 'Recept szerkesztése',

  noIndex: true,
});

export default EditPage;
