import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';

import {
  getHasVerifiedVersion,
  getRecipeAuthor,
  getRecipeCategories,
  getRecipeIngredients,
} from './index';

export async function getRecipe(id: number, allowUnverified: boolean = false) {
  const whereClause = allowUnverified
    ? eq(recipeData.recipeId, id)
    : and(eq(recipeData.recipeId, id), eq(recipeData.verified, true));

  const [recipe, recipeDataRecord] = await Promise.all([
    db.query.recipes.findFirst({ where: eq(recipes.id, id) }),
    db.query.recipeData.findFirst({
      orderBy: desc(recipeData.createdAt),
      where: whereClause,
    }),
  ]);

  if (!recipe || !recipeDataRecord) return null;

  const [categories, ingredients, author, hasVerifiedVersion] = await Promise.all([
    getRecipeCategories(recipe.id),
    getRecipeIngredients(recipeDataRecord.id),
    getRecipeAuthor(recipe.userId),
    allowUnverified ? getHasVerifiedVersion(recipe.id) : true,
  ]);

  return {
    author,
    categories,
    hasVerifiedVersion,
    ingredients,
    recipe,
    recipeData: recipeDataRecord,
  };
}
