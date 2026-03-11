import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { categoriesSearchSchema, type PaginationMeta } from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, recipeData, recipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import {
  buildFtsClause,
  buildLatestRecipeData,
  buildRecipeDataJoinClause,
  enrichRecipes,
} from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

const getUserRecipesSchema = z.object({
  categories: categoriesSearchSchema,
  query: z.string().trim().nullable().catch(null),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const { data: params, success } = getUserRecipesSchema.safeParse({
    categories: searchParams.get('categories'),
    query: searchParams.get('query'),
  });

  if (!success) {
    return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
  }

  const ftsWhereClause = buildFtsClause(params.query);
  const categoryIds = params.categories?.length ? params.categories : undefined;
  const categoryWhereClause =
    categoryIds && categoryIds.length > 0
      ? inArray(categoryRecipe.categoryId, categoryIds)
      : undefined;

  const latestRd = buildLatestRecipeData();
  const joinClause = buildRecipeDataJoinClause(latestRd);

  const baseCountQuery = db
    .select({ count: count() })
    .from(recipes)
    .innerJoin(latestRd, eq(latestRd.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .$dynamic();

  const baseRecipesQuery = db
    .select({ recipe: recipes })
    .from(recipes)
    .innerJoin(latestRd, eq(latestRd.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .$dynamic();

  if (categoryWhereClause) {
    baseCountQuery.innerJoin(
      categoryRecipe,
      and(eq(categoryRecipe.recipeId, recipes.id), categoryWhereClause),
    );
    baseRecipesQuery.innerJoin(
      categoryRecipe,
      and(eq(categoryRecipe.recipeId, recipes.id), categoryWhereClause),
    );
  }

  const [totalResult] = await baseCountQuery.where(and(eq(recipes.userId, userId), ftsWhereClause));

  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await baseRecipesQuery
    .where(and(eq(recipes.userId, userId), ftsWhereClause))
    .orderBy(desc(recipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await enrichRecipes(recipeRecords);

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
