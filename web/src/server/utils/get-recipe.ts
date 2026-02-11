import { type NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { and, desc, eq, not } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import {
  getRecipeAuthor,
  getRecipeCategories,
  getRecipeIngredients,
} from '~/server/utils/recipe-helpers';

export async function getRecipe(id: number, allowUnverified: boolean = false) {
  const joinClause = allowUnverified
    ? eq(recipeData.recipeId, recipes.id)
    : and(eq(recipeData.recipeId, recipes.id), eq(recipeData.verified, true));

  const recipeRecords = await db
    .select({
      recipe: recipes,
      recipeData,
    })
    .from(recipes)
    .innerJoin(recipeData, joinClause)
    .where(eq(recipes.id, id))
    .orderBy(desc(recipes.createdAt));

  if (!recipeRecords?.[0]) notFound();

  const recipeRecord = recipeRecords[0];

  const [categories, ingredients, author] = await Promise.all([
    getRecipeCategories(recipeRecord.recipe.id),
    getRecipeIngredients(recipeRecord.recipeData.id),
    getRecipeAuthor(recipeRecord.recipe.userId),
  ]);

  return {
    recipe: recipeRecord.recipe,
    recipeData: recipeRecord.recipeData,
    categories,
    ingredients,
    author,
  };
}
