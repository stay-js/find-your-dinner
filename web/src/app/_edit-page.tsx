import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { RecipeForm } from '~/components/recipe-form';
import { SetRecipeTitle } from '~/contexts/recipe-title-context';
import { idParamSchema } from '~/lib/zod';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipe } from '~/server/utils/recipe-helpers';

export async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin(userId);

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipeResult = await getRecipe(id, true);
  if (!recipeResult) notFound();

  const { author, categories, ingredients, recipe, recipeData } = recipeResult;

  if (!isAdmin && author.id !== userId) notFound();

  const defaultValues = {
    title: recipeData.title,

    description: recipeData.description,
    instructions: recipeData.instructions,

    previewImageUrl: recipeData.previewImageUrl,

    cookTimeMinutes: recipeData.cookTimeMinutes.toString(),
    prepTimeMinutes: recipeData.prepTimeMinutes.toString(),

    servings: recipeData.servings.toString(),

    categories: categories.map((c) => c.id),

    ingredients: ingredients.map((i) => ({
      ingredientId: i.ingredient.id.toString(),
      quantity: i.quantity.toString(),
      unitId: i.unit.id.toString(),
    })),
  };

  return (
    <>
      <SetRecipeTitle title={recipeData.title} />
      <RecipeForm defaultValues={defaultValues} recipeId={recipe.id} />
    </>
  );
}
