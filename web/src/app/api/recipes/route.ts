import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { createUpdateRecipeSchema } from '~/lib/zod-schemas';
import { db } from '~/server/db';
import { categoryRecipe, ingredientRecipeData, recipeData, recipes } from '~/server/db/schema';

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await request.json();
  const result = createUpdateRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, error: 'INVALID_REQUEST_BODY' },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = result.data;

  try {
    await db.transaction(async (tx) => {
      const recipeInsertResult = await tx
        .insert(recipes)
        .values({ userId })
        .returning({ id: recipes.id });

      const recipeId = recipeInsertResult.at(0)?.id;
      if (!recipeId) throw new Error('Failed to retrieve inserted recipe ID');

      const recipeDataInsertResult = await tx
        .insert(recipeData)
        .values({ recipeId, ...data })
        .returning({ id: recipeData.id });

      const recipeDataId = recipeDataInsertResult.at(0)?.id;
      if (!recipeDataId) throw new Error('Failed to retrieve inserted recipe data ID');

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ categoryId, recipeId })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));
    });

    return NextResponse.json({ message: 'CREATED' }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { details: String(err), error: 'FAILED_TO_CREATE_RECIPE' },
      { status: 500 },
    );
  }
}
