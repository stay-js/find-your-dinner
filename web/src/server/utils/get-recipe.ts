import { notFound } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import {
  getHasVerifiedVersion,
  getRecipeAuthor,
  getRecipeCategories,
  getRecipeIngredients,
} from '~/server/utils/recipe-helpers';

export async function getRecipe(id: number, allowUnverified: boolean = false) {
  const whereClause = allowUnverified
    ? eq(recipeData.recipeId, id)
    : and(eq(recipeData.recipeId, id), eq(recipeData.verified, true));

  const [recipe, recipeDataRecord] = await Promise.all([
    db.query.recipes.findFirst({ where: eq(recipes.id, id) }),
    db.query.recipeData.findFirst({
      where: whereClause,
      orderBy: desc(recipeData.createdAt),
    }),
  ]);

  if (!recipe || !recipeDataRecord) notFound();

  const [categories, ingredients, author, hasVerifiedVersion] = await Promise.all([
    getRecipeCategories(recipe.id),
    getRecipeIngredients(recipeDataRecord.id),
    getRecipeAuthor(recipe.userId),
    allowUnverified ? getHasVerifiedVersion(recipe.id) : true,
  ]);

  return {
    recipe,
    recipeData: recipeDataRecord,
    categories,
    ingredients,
    author,
    hasVerifiedVersion,
  };
}
