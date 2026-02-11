import { RecipePage } from '~/app/_recipe-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',
  title: 'Recept',
  description: 'Recept - Find Your Dinner.',
});

export default RecipePage;
