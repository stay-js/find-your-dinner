import { auth } from '@clerk/nextjs/server';
import { count, desc, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const [totalResult] = await db
    .select({ count: count() })
    .from(recipes)
    .where(eq(recipes.userId, userId));

  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await Promise.all(
    recipeRecords.map(async (recipe) => {
      const [recipeDataRecord, categories, hasVerifiedVersion] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: eq(recipeData.recipeId, recipe.id),
        }),

        getRecipeCategories(recipe.id),
        getHasVerifiedVersion(recipe.id),
      ]);

      return {
        categories,
        hasVerifiedVersion,
        recipe,
        recipeData: recipeDataRecord,
      };
    }),
  );

  return NextResponse.json({
    data: result,
    meta: {
      currentPage: page,
      pageCount,
      perPage: PAGE_SIZE,
      total,
    },
  });
}
