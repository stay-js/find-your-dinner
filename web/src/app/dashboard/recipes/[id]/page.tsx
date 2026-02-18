import { RecipePage } from '~/app/_recipe-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/[id]',

  description: 'Recept - Find Your Dinner.',
  title: 'Recept',

  noIndex: true,
});

export default RecipePage;
