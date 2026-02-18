import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { RecipeForm } from '~/components/recipe-form';
import { idParamSchema } from '~/lib/zod';
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
    description: recipeData.description,
    instructions: recipeData.instructions,
    title: recipeData.title,

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

  return <RecipeForm defaultValues={defaultValues} recipeId={recipe.id} />;
}
