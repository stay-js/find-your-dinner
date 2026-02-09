import { and, desc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';
import { getIngredientsForRecipe } from '~/server/utils/get-ingredients-for-recipe';
import { getOwnerForRecipe } from '~/server/utils/get-owner-for-recipe';
import { idParamSchema } from '~/lib/zod-schemas';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });
  if (!recipe) notFound();

  const recipeDataRecord = await db.query.recipeData.findFirst({
    where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
    orderBy: desc(recipeData.createdAt),
  });

  if (!recipeDataRecord) notFound();

  const [categories, owner] = await Promise.all([
    getCategoriesForRecipe(recipe.id),
    getOwnerForRecipe(recipe.userId),
  ]);

  const ingredients = await getIngredientsForRecipe(recipeDataRecord.id);

  const recipeWithDetails = {
    recipe,
    recipeData: recipeDataRecord,
    categories,
    ingredients,
    owner,
  };

  return <div>{recipeWithDetails.recipeData.title}</div>;
}
