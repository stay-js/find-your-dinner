import { EditPage as AdminEditPage } from '~/app/_edit-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/edit',
  title: 'Recept szerkesztése - Admin',
  description: 'Recept szerkesztése - Admin',
  noIndex: true,
});

export default AdminEditPage;
