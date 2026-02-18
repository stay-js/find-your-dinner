import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const recipeRecords = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async (recipe) => {
      const [recipeDataRecord, categories, hasVerifiedVersion] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: eq(recipeData.recipeId, recipe.id),
        }),

        getRecipeCategories(recipe.id),
        getHasVerifiedVersion(recipe.id),
      ]);

      return {
        categories,
        hasVerifiedVersion,
        recipe,
        recipeData: recipeDataRecord,
      };
    }),
  );

  return NextResponse.json(result);
}
