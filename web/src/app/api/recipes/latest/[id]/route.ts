import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getIngredientsForRecipe } from '~/server/utils/get-ingredients-for-recipe';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';
import { getOwnerForRecipe } from '~/server/utils/get-owner-for-recipe';
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });

  if (!recipe) {
    return NextResponse.json({ error: 'RECIPE_NOT_FOUND' }, { status: 404 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (recipe.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const [recipeDataRecord, categories, owner] = await Promise.all([
    db.query.recipeData.findFirst({
      where: eq(recipeData.recipeId, recipe.id),
      orderBy: desc(recipeData.createdAt),
    }),

    getCategoriesForRecipe(recipe.id),
    getOwnerForRecipe(recipe.userId),
  ]);

  if (!recipeDataRecord) {
    return NextResponse.json({ error: 'RECIPE_DATA_NOT_FOUND' }, { status: 404 });
  }

  const ingredients = await getIngredientsForRecipe(recipeDataRecord.id);

  return NextResponse.json({
    recipe,
    recipeData: recipeDataRecord,
    categories,
    ingredients,
    owner,
  });
}
