import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq, inArray } from 'drizzle-orm';

import { db } from '~/server/db';
import {
  categories,
  categoryRecipe,
  recipeData,
  recipes as recipesTable,
} from '~/server/db/schema';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ isAdmin: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const recipes = await db
    .select()
    .from(recipesTable)
    .where(eq(recipesTable.userId, userId))
    .orderBy(desc(recipesTable.createdAt));

  const result = await Promise.all(
    recipes.map(async (recipe) => {
      const categoryRelations = await db
        .select()
        .from(categoryRecipe)
        .where(eq(categoryRecipe.recipeId, recipe.id));

      const categoryIds = categoryRelations.map((relation) => relation.categoryId);

      const categoryRecords = await db
        .select()
        .from(categories)
        .where(inArray(categories.id, categoryIds));

      const data = await db
        .select()
        .from(recipeData)
        .where(eq(recipeData.recipeId, recipe.id))
        .orderBy(desc(recipeData.createdAt))
        .limit(1);

      return {
        recipe,
        recipeData: data?.[0],
        categories: categoryRecords,
      };
    }),
  );

  return NextResponse.json({ recipes: result });
}
