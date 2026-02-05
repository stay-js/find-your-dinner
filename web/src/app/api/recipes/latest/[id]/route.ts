import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import {
  categories,
  categoryRecipe,
  ingredientRecipeData,
  ingredients,
  recipeData,
  recipes,
  units,
} from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  if (!recipe) {
    return NextResponse.json({ error: 'RECIPE_NOT_FOUND' }, { status: 404 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (recipe.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const clerk = await clerkClient();

  const [data, categoryRecords, owner] = await Promise.all([
    db.query.recipeData.findFirst({
      where: eq(recipeData.recipeId, recipe.id),
      orderBy: desc(recipeData.createdAt),
    }),

    db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categoryRecipe)
      .innerJoin(categories, eq(categories.id, categoryRecipe.categoryId))
      .where(eq(categoryRecipe.recipeId, recipe.id)),

    clerk.users.getUser(recipe.userId),
  ]);

  if (!data) {
    return NextResponse.json({ error: 'RECIPE_DATA_NOT_FOUND' }, { status: 404 });
  }

  const ingredientRecords = await db
    .select({
      ingredient: ingredients,
      quantity: ingredientRecipeData.quantity,
      unit: units,
    })
    .from(ingredientRecipeData)
    .innerJoin(ingredients, eq(ingredients.id, ingredientRecipeData.ingredientId))
    .innerJoin(units, eq(units.id, ingredientRecipeData.unitId))
    .where(eq(ingredientRecipeData.recipeDataId, data.id));

  return NextResponse.json({
    recipe,
    recipeData: data,
    categories: categoryRecords,
    ingredients: ingredientRecords,
    owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
    },
  });
}
