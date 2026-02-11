import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { getRecipeCategories } from '~/server/utils/recipe-helpers';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const recipeRecords = await db
    .select({
      recipe: recipes,
      recipeData,
    })
    .from(recipes)
    .innerJoin(recipeData, eq(recipeData.recipeId, recipes.id))
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe, recipeData }) => {
      const categories = await getRecipeCategories(recipe.id);

      return {
        recipe,
        recipeData,
        categories,
      };
    }),
  );

  return NextResponse.json(result);
}
