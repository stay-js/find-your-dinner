import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { RecipeForm } from '~/components/recipe-form';
import { idParamSchema } from '~/lib/zod-schemas';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipe } from '~/server/utils/get-recipe';

export async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin(userId);

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const { author, categories, ingredients, recipe, recipeData } = await getRecipe(id, true);

  if (!isAdmin && author.id !== userId) notFound();

  const defaultValues = {
    categories: categories.map((c) => c.id),
    cookTimeMinutes: recipeData.cookTimeMinutes.toString(),
    description: recipeData.description,
    ingredients: ingredients.map((i) => ({
      ingredientId: i.ingredient.id.toString(),
      quantity: i.quantity.toString(),
      unitId: i.unit.id.toString(),
    })),
    instructions: recipeData.instructions,
    prepTimeMinutes: recipeData.prepTimeMinutes.toString(),
    previewImageUrl: recipeData.previewImageUrl,
    servings: recipeData.servings.toString(),
    title: recipeData.title,
  };

  return <RecipeForm defaultValues={defaultValues} recipeId={recipe.id} />;
}
