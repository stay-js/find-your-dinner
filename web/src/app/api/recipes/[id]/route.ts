import { type NextRequest, NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { getIngredientsForRecipe } from '~/server/utils/get-ingredients-for-recipe';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';
import { getOwnerForRecipe } from '~/server/utils/get-owner-for-recipe';
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const recipeDataRecord = await db.query.recipeData.findFirst({
    where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
    orderBy: desc(recipeData.createdAt),
  });

  if (!recipeDataRecord) {
    return NextResponse.json({ error: 'NO_VERIFIED_RECIPE_DATA' }, { status: 404 });
  }

  const [categories, owner] = await Promise.all([
    getCategoriesForRecipe(recipe.id),
    getOwnerForRecipe(recipe.userId),
  ]);

  const ingredients = await getIngredientsForRecipe(recipeDataRecord.id);

  return NextResponse.json({
    recipe,
    recipeData: recipeDataRecord,
    categories,
    ingredients,
    owner,
  });
}
