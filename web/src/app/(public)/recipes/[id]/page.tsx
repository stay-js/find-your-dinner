import { RecipePage } from '~/app/_recipe-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',

  description: 'Recept - Find Your Dinner.',
  title: 'Recept',
});

export default RecipePage;
