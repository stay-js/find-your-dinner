import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const recipeRecords = await db
    .select({
      recipe: recipes,
      recipeData,
    })
    .from(recipes)
    .innerJoin(recipeData, and(eq(recipeData.recipeId, recipes.id), eq(recipeData.verified, false)))
    .orderBy(desc(recipeData.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe, recipeData }) => {
      const [categories, hasVerifiedVersion] = await Promise.all([
        getRecipeCategories(recipe.id),
        getHasVerifiedVersion(recipe.id),
      ]);

      return {
        recipe,
        recipeData,
        categories,
        hasVerifiedVersion,
      };
    }),
  );

  return NextResponse.json(result);
}
