import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipeCategories } from '~/server/utils/recipe-helpers';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const recipeDataRecords = await db
    .select()
    .from(recipeData)
    .where(eq(recipeData.verified, false))
    .orderBy(desc(recipeData.createdAt));

  const result = await Promise.all(
    recipeDataRecords.map(async (recipeData) => {
      const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, recipeData.recipeId),
      });

      if (!recipe) {
        return NextResponse.json(
          {
            error: 'RECIPE_NOT_FOUND',
            details: {
              recipeId: recipeData.recipeId,
            },
          },
          {
            status: 404,
          },
        );
      }

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
