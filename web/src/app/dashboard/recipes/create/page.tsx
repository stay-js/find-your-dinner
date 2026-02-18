import { RecipeForm } from '~/components/recipe-form';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/create',

  description: 'Recept létrehozása - Find Your Dinner.',
  title: 'Recept létrehozása',

  noIndex: true,
});

const defaultValues = {
  categories: [],
  cookTimeMinutes: '',
  description: '',
  ingredients: [
    {
      ingredientId: '',
      quantity: '',
      unitId: '',
    },
  ],
  instructions: '',
  prepTimeMinutes: '',
  previewImageUrl: '',
  servings: '',
  title: '',
};

export default async function CreatePage() {
  return <RecipeForm defaultValues={defaultValues} />;
}
