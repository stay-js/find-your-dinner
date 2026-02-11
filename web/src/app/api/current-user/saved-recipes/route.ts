import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/server/db';
import { recipes, recipeData, savedRecipes } from '~/server/db/schema';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';

export async function GET(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includeRecipe = searchParams.get('include') === 'recipe';

  if (!includeRecipe) {
    const result = await db
      .select({
        savedAt: savedRecipes.createdAt,
        recipeId: savedRecipes.recipeId,
      })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId));

    return NextResponse.json(result);
  }

  const recipeRecords = await db
    .select({
      savedAt: savedRecipes.createdAt,
      recipe: recipes,
    })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .where(eq(savedRecipes.userId, userId));

  const result = await Promise.all(
    recipeRecords.map(async ({ savedAt, recipe }) => {
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
        savedAt,
        recipe,
        recipeData: recipeDataRecord,
        categories,
      };
    }),
  );

  return NextResponse.json(result);
}

const createSavedRecipeSchema = z.object({
  recipeId: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await request.json();
  const result = createSavedRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_REQUEST_BODY', details: result.error },
      { status: 400 },
    );
  }

  const { recipeId } = result.data;

  await db.insert(savedRecipes).values({ userId, recipeId });

  return NextResponse.json({ message: 'CREATED' }, { status: 201 });
}
