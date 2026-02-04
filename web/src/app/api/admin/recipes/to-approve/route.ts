import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { categories, categoryRecipe, recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const recipeDataRecords = await db
    .select()
    .from(recipeData)
    .where(eq(recipeData.verified, false))
    .orderBy(desc(recipeData.createdAt));

  const result = await Promise.all(
    recipeDataRecords.map(async (recipeData) => {
      const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, recipeData.recipeId),
      });

      if (!recipe) {
        throw new Error(`No recipe found for recipe data ID: ${recipeData.id}`);
      }

      const categoryRecords = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categoryRecipe)
        .innerJoin(categories, eq(categories.id, categoryRecipe.categoryId))
        .where(eq(categoryRecipe.recipeId, recipe.id));

      return {
        recipe,
        recipeData,
        categories: categoryRecords,
      };
    }),
  );

  return NextResponse.json(result);
}
