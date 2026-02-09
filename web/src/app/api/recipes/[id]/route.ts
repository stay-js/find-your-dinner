import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';

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
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const recipeDataRecord = await db.query.recipeData.findFirst({
    where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
    orderBy: desc(recipeData.createdAt),
  });

  if (!recipeDataRecord) {
    return NextResponse.json({ error: 'RECIPE_NOT_FOUND' }, { status: 404 });
  }

  const clerk = await clerkClient();

  const [categoryRecords, owner] = await Promise.all([
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

  const ingredientRecords = await db
    .select({
      ingredient: ingredients,
      quantity: ingredientRecipeData.quantity,
      unit: units,
    })
    .from(ingredientRecipeData)
    .innerJoin(ingredients, eq(ingredients.id, ingredientRecipeData.ingredientId))
    .innerJoin(units, eq(units.id, ingredientRecipeData.unitId))
    .where(eq(ingredientRecipeData.recipeDataId, recipeDataRecord.id));

  return NextResponse.json({
    recipe,
    recipeData: recipeDataRecord,
    categories: categoryRecords,
    ingredients: ingredientRecords,
    owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
    },
  });
}
