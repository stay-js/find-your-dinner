import { EditPage as AdminEditPage } from '~/app/_edit-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/edit',

  description: 'Recept szerkesztése - Admin - Find Your Dinner.',
  title: 'Recept szerkesztése - Admin',

  noIndex: true,
});

export default AdminEditPage;
