import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { categories, categoryRecipe, recipeData, recipes } from '~/server/db/schema';
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

  const [categoryRecords, data] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categoryRecipe)
      .innerJoin(categories, eq(categories.id, categoryRecipe.categoryId))
      .where(eq(categoryRecipe.recipeId, recipe.id)),

    db.query.recipeData.findFirst({
      where: eq(recipeData.recipeId, recipe.id),
      orderBy: desc(recipeData.createdAt),
    }),
  ]);

  if (!data) {
    return NextResponse.json({ error: 'RECIPE_DATA_NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json({
    recipe,
    recipeData: data,
    categories: categoryRecords,
  });
}
