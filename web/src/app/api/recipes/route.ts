import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { createUpdateRecipeSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, ingredientRecipeData, recipeData, recipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const body = await request.json();
  const result = createUpdateRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = result.data;

  try {
    const recipeId = await db.transaction(async (tx) => {
      const recipeInsertResult = await tx
        .insert(recipes)
        .values({ userId })
        .returning({ id: recipes.id });

      const recipeId = recipeInsertResult.at(0)?.id;
      if (!recipeId) throw new Error('Failed to insert recipe');

      const recipeDataInsertResult = await tx
        .insert(recipeData)
        .values({ recipeId, ...data })
        .returning({ id: recipeData.id });

      const recipeDataId = recipeDataInsertResult.at(0)?.id;
      if (!recipeDataId) throw new Error('Failed to insert recipe data');

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ categoryId, recipeId })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));

      return recipeId;
    });

    return NextResponse.json({ message: 'Created', recipeId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to create recipe' }, { status: 500 });
  }
}
