import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, exists } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '~/server/db';
import { recipeData, recipes, savedRecipes } from '~/server/db/schema';
import { getRecipeCategories } from '~/server/utils/recipe-helpers';

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
        recipeId: savedRecipes.recipeId,
        savedAt: savedRecipes.createdAt,
      })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId));

    return NextResponse.json(result);
  }

  const recipeRecords = await db
    .select({
      recipe: recipes,
      savedAt: savedRecipes.createdAt,
    })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .where(
      and(
        eq(savedRecipes.userId, userId),
        exists(
          db
            .select()
            .from(recipeData)
            .where(and(eq(recipeData.recipeId, recipes.id), eq(recipeData.verified, true))),
        ),
      ),
    )
    .orderBy(desc(savedRecipes.createdAt));

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe, savedAt }) => {
      const [recipeDataRecord, categories] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
        }),

        getRecipeCategories(recipe.id),
      ]);

      return {
        categories,
        hasVerifiedVersion: true,
        recipe,
        recipeData: recipeDataRecord,
        savedAt,
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
      { details: result.error, error: 'INVALID_REQUEST_BODY' },
      { status: 400 },
    );
  }

  const { recipeId } = result.data;

  await db.insert(savedRecipes).values({ recipeId, userId });

  return NextResponse.json({ message: 'CREATED' }, { status: 201 });
}
