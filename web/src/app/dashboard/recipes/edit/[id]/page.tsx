import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { getRecipe } from '~/server/utils/get-recipe';
import { idParamSchema } from '~/lib/zod-schemas';
import { createMetadata } from '~/lib/create-metadata';
import { RecipeForm } from '~/components/recipe-form';

export const metadata = createMetadata({
  path: '/dashboard/recipes/edit',
  title: 'Recept szerkesztése - Find Your Dinner.',
  description: 'Recept szerkesztése - Find Your Dinner.',
  noIndex: true,
});

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const { recipe, recipeData, categories, ingredients, author } = await getRecipe(id, true);

  if (author.id !== userId) notFound();

  const defaultValues = {
    title: recipeData.title,
    previewImageUrl: recipeData.previewImageUrl,
    description: recipeData.description,
    instructions: recipeData.instructions,
    prepTimeMinutes: recipeData.prepTimeMinutes.toString(),
    cookTimeMinutes: recipeData.cookTimeMinutes.toString(),
    servings: recipeData.servings.toString(),
    categories: categories.map((c) => c.id),
    ingredients: ingredients.map((i) => ({
      ingredientId: i.ingredient.id.toString(),
      quantity: i.quantity.toString(),
      unitId: i.unit.id.toString(),
    })),
  };

  return <RecipeForm defaultValues={defaultValues} recipeId={recipe.id} />;
}
