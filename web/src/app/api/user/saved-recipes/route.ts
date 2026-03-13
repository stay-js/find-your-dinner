import { auth } from '@clerk/nextjs/server';
import { and, countDistinct, desc, eq, inArray } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createSavedRecipeSchema, idArraySearchSchema, type PaginationMeta } from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, recipeData, recipes, savedRecipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import {
  buildFtsClause,
  buildLatestRecipeData,
  buildRecipeDataJoinClause,
  enrichRecipes,
} from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

const getSavedRecipesSchema = z.object({
  categories: idArraySearchSchema,
  include: z.string().nullable().catch(null),
  query: z.string().trim().nullable().catch(null),
});

export async function GET(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const { searchParams } = new URL(request.url);

  const { data: params, success } = getSavedRecipesSchema.safeParse({
    categories: searchParams.get('categories'),
    include: searchParams.get('include'),
    query: searchParams.get('query'),
  });

  if (!success) {
    return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
  }

  const includeRecipe = params.include === 'recipe';

  if (!includeRecipe) {
    const result = await db
      .select({
        recipeId: savedRecipes.recipeId,
        savedAt: savedRecipes.createdAt,
      })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId));

    return NextResponse.json(result);
  }

  const ftsWhereClause = buildFtsClause(params.query);
  const categoryIds = params.categories?.length ? params.categories : undefined;
  const categoryWhereClause =
    categoryIds && categoryIds.length > 0
      ? inArray(categoryRecipe.categoryId, categoryIds)
      : undefined;

  const latestRd = buildLatestRecipeData(true);
  const joinClause = buildRecipeDataJoinClause(latestRd, { verifiedOnly: true });

  const baseCountQuery = db
    .select({ count: countDistinct(recipes.id) })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .innerJoin(latestRd, eq(latestRd.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .$dynamic();

  const baseRecipesQuery = db
    .select({ recipe: recipes })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
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

  const [totalResult] = await baseCountQuery.where(
    and(eq(savedRecipes.userId, userId), ftsWhereClause),
  );

  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await baseRecipesQuery
    .where(and(eq(savedRecipes.userId, userId), ftsWhereClause))
    .groupBy(recipes.id)
    .orderBy(desc(savedRecipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await enrichRecipes(recipeRecords, { verifiedOnly: true });

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

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const body = await request.json();
  const result = createSavedRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { recipeId } = result.data;

  await db.insert(savedRecipes).values({ recipeId, userId });

  return NextResponse.json({ message: 'Recipe saved', recipeId }, { status: 201 });
}
