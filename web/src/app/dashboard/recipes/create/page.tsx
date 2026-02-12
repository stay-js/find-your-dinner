import { createMetadata } from '~/lib/create-metadata';
import { RecipeForm } from '~/components/recipe-form';

export const metadata = createMetadata({
  path: '/dashboard/recipes/create',
  title: 'Recept létrehozása',
  description: 'Recept létrehozása - Find Your Dinner.',
  noIndex: true,
});

const defaultValues = {
  title: '',
  previewImageUrl: '',
  description: '',
  instructions: '',
  prepTimeMinutes: '',
  cookTimeMinutes: '',
  servings: '',
  categories: [],
  ingredients: [
    {
      ingredientId: '',
      quantity: '',
      unitId: '',
    },
  ],
};

export default async function CreatePage() {
  return <RecipeForm defaultValues={defaultValues} />;
}
