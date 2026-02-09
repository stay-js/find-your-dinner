import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const recipeRecords = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async (recipe) => {
      const [categories, recipeDataRecord] = await Promise.all([
        getCategoriesForRecipe(recipe.id),

        db.query.recipeData.findFirst({
          where: eq(recipeData.recipeId, recipe.id),
          orderBy: desc(recipeData.createdAt),
        }),
      ]);

      if (!recipeDataRecord) {
        return NextResponse.json(
          {
            error: 'RECIPE_DATA_NOT_FOUND',
            details: {
              recipeId: recipe.id,
            },
          },
          {
            status: 404,
          },
        );
      }

      return {
        recipe,
        recipeData: recipeDataRecord,
        categories,
      };
    }),
  );

  return NextResponse.json(result);
}
