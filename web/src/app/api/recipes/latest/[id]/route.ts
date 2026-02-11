import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import {
  getRecipeAuthor,
  getRecipeCategories,
  getRecipeIngredients,
} from '~/server/utils/recipe-helpers';
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_RECIPE_ID', details: result.error },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipeRecords = await db
    .select({
      recipe: recipes,
      recipeData,
    })
    .from(recipes)
    .innerJoin(recipeData, eq(recipeData.recipeId, recipes.id))
    .where(eq(recipes.id, id))
    .orderBy(desc(recipes.createdAt));

  if (!recipeRecords?.[0]) {
    return NextResponse.json({ error: 'RECIPE_NOT_FOUND' }, { status: 404 });
  }

  const recipeRecord = recipeRecords[0];

  const isAdmin = await checkIsAdmin(userId);

  if (recipeRecord.recipe.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const [categories, ingredients, author] = await Promise.all([
    getRecipeCategories(recipeRecord.recipe.id),
    getRecipeIngredients(recipeRecord.recipeData.id),
    getRecipeAuthor(recipeRecord.recipe.userId),
  ]);

  return NextResponse.json({
    recipe: recipeRecord.recipe,
    recipeData: recipeRecord.recipeData,
    categories,
    ingredients,
    author,
  });
}
