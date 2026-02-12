import { notFound } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

import { db } from '~/server/db';
import { recipes, categoryRecipe, recipeData, ingredientRecipeData } from '~/server/db/schema';
import { getRecipe } from '~/server/utils/get-recipe';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { idParamSchema } from '~/lib/zod-schemas';
import { createRecipeSchema } from '~/lib/zod-schemas';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_RECIPE_ID', details: result.error },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await getRecipe(id);

  return NextResponse.json(recipe);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_RECIPE_ID', details: result.error },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });
  if (!recipe) notFound();

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin && recipe.userId !== userId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await request.json();
  const bodyResult = createRecipeSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      { error: 'INVALID_REQUEST_BODY', details: bodyResult.error },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = bodyResult.data;

  try {
    await db.transaction(async (tx) => {
      const recipeDataInsert = await tx
        .insert(recipeData)
        .values({ recipeId: recipe.id, ...data })
        .$returningId();

      const recipeDataId = recipeDataInsert[0]?.id;
      if (!recipeDataId) throw new Error('Failed to retrieve inserted recipe data ID');

      await tx.delete(categoryRecipe).where(eq(categoryRecipe.recipeId, recipe.id));

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ recipeId: recipe.id, categoryId })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: 'FAILED_TO_UPDATE_RECIPE', details: String(err) },
      { status: 500 },
    );
  }
}
