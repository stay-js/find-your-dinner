import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { recipes, categoryRecipe, recipeData, ingredientRecipeData } from '~/server/db/schema';
import { createRecipeSchema } from '~/lib/zod-schemas';

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await request.json();
  const result = createRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_REQUEST_BODY', details: result.error },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = result.data;

  try {
    await db.transaction(async (tx) => {
      const recipeInsert = await tx.insert(recipes).values({ userId }).$returningId();

      const recipeId = recipeInsert[0]?.id;
      if (!recipeId) throw new Error('Failed to retrieve inserted recipe ID');

      const recipeDataInsert = await tx
        .insert(recipeData)
        .values({ recipeId, ...data })
        .$returningId();

      const recipeDataId = recipeDataInsert[0]?.id;
      if (!recipeDataId) throw new Error('Failed to retrieve inserted recipe data ID');

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ recipeId, categoryId })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));
    });

    return NextResponse.json({ message: 'CREATED' }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'FAILED_TO_CREATE_RECIPE', details: String(err) },
      { status: 500 },
    );
  }
}
