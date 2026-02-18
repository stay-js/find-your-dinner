import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, max } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const latestRecipeData = db
    .select({
      latestCreatedAt: max(recipeData.createdAt).as('latestCreatedAt'),
      recipeId: recipeData.recipeId,
    })
    .from(recipeData)
    .groupBy(recipeData.recipeId)
    .as('latestRecipeData');

  const recipeRecords = await db
    .select({ recipe: recipes })
    .from(recipes)
    .innerJoin(latestRecipeData, eq(latestRecipeData.recipeId, recipes.id))
    .innerJoin(
      recipeData,
      and(
        eq(recipeData.recipeId, latestRecipeData.recipeId),
        eq(recipeData.createdAt, latestRecipeData.latestCreatedAt),
        eq(recipeData.verified, false),
      ),
    )
    .orderBy(desc(recipes.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe }) => {
      const [recipeDataRecord, categories, hasVerifiedVersion] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, false)),
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
