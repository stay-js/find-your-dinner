import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, max } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { type PaginationMeta } from '~/lib/zod';
import { db } from '~/server/db';
import { recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const latestRecipeData = db
    .select({
      latestCreatedAt: max(recipeData.createdAt).as('latestCreatedAt'),
      recipeId: recipeData.recipeId,
    })
    .from(recipeData)
    .groupBy(recipeData.recipeId)
    .as('latestRecipeData');

  const joinClause = and(
    eq(recipeData.recipeId, latestRecipeData.recipeId),
    eq(recipeData.createdAt, latestRecipeData.latestCreatedAt),
    eq(recipeData.verified, false),
  );

  const [totalResult] = await db
    .select({ count: count() })
    .from(recipes)
    .innerJoin(latestRecipeData, eq(latestRecipeData.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause);

  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await db
    .select({ recipe: recipes })
    .from(recipes)
    .innerJoin(latestRecipeData, eq(latestRecipeData.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .orderBy(desc(recipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe }) => {
      const [recipeDataRecord, categories, hasVerifiedVersion] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, false)),
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
    } satisfies PaginationMeta,
  });
}
