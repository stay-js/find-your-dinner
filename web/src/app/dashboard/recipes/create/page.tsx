import { RecipeForm } from '~/components/recipe-form';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/create',

  description: 'Recept létrehozása',
  title: 'Recept létrehozása',

  noIndex: true,
});

const defaultValues = {
  description: '',
  instructions: '',
  title: '',

  previewImageUrl: '',

  cookTimeMinutes: '',
  prepTimeMinutes: '',

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
