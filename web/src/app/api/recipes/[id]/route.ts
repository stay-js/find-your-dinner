import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateRecipeSchema, idParamSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, ingredientRecipeData, recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getRecipe } from '~/server/utils/get-recipe';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = request.nextUrl;

  const allowUnverified = ['1', 'true'].includes(searchParams.get('allow-unverified') ?? '');

  if (allowUnverified) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) return unauthorized();

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) return forbidden();
  }

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid recipe id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await getRecipe(id, allowUnverified);
  if (!recipe) notFound();

  return NextResponse.json(recipe);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid recipe id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });
  if (!recipe) notFound();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin && recipe.userId !== userId) return forbidden();

  const body = await request.json();
  const bodyResult = createUpdateRecipeSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      { details: bodyResult.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = bodyResult.data;

  try {
    await db.transaction(async (tx) => {
      const insertResult = await tx
        .insert(recipeData)
        .values({ recipeId: recipe.id, ...data })
        .returning({ id: recipeData.id });

      const recipeDataId = insertResult.at(0)?.id;
      if (!recipeDataId) throw new Error('Failed to insert recipe data');

      await tx.delete(categoryRecipe).where(eq(categoryRecipe.recipeId, recipe.id));

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ categoryId, recipeId: recipe.id })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to update recipe' }, { status: 500 });
  }
}
