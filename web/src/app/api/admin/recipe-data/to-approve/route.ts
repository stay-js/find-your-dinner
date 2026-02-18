import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, exists } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
    .select({ recipe: recipes })
    .from(recipes)
    .where(
      exists(
        db
          .select()
          .from(recipeData)
          .where(and(eq(recipeData.recipeId, recipes.id), eq(recipeData.verified, false))),
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
