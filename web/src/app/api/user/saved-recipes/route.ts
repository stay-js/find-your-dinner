import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, max, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createSavedRecipeSchema, type PaginationMeta } from '~/lib/zod';
import { db } from '~/server/db';
import { recipeData, recipes, savedRecipes } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import { getRecipeCategories } from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const { searchParams } = new URL(request.url);
  const includeRecipe = searchParams.get('include') === 'recipe';

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

  const searchQuery = searchParams.get('query')?.trim();

  const ftsWhereClause =
    searchQuery && searchQuery.length >= 3
      ? sql`(
        setweight(to_tsvector('hungarian', ${recipeData.title}), 'A') ||
        setweight(to_tsvector('hungarian', ${recipeData.description}), 'B')
      ) @@ plainto_tsquery('hungarian', ${searchQuery})`
      : undefined;

  const latestRecipeData = db
    .select({
      latestCreatedAt: max(recipeData.createdAt).as('latestCreatedAt'),
      recipeId: recipeData.recipeId,
    })
    .from(recipeData)
    .where(eq(recipeData.verified, true))
    .groupBy(recipeData.recipeId)
    .as('latestRecipeData');

  const joinClause = and(
    eq(recipeData.recipeId, latestRecipeData.recipeId),
    eq(recipeData.createdAt, latestRecipeData.latestCreatedAt),
    eq(recipeData.verified, true),
  );

  const [totalResult] = await db
    .select({ count: count() })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .innerJoin(latestRecipeData, eq(latestRecipeData.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .where(and(eq(savedRecipes.userId, userId), ftsWhereClause));

  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await db
    .select({
      recipe: recipes,
      savedAt: savedRecipes.createdAt,
    })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .innerJoin(latestRecipeData, eq(latestRecipeData.recipeId, recipes.id))
    .innerJoin(recipeData, joinClause)
    .where(and(eq(savedRecipes.userId, userId), ftsWhereClause))
    .orderBy(desc(savedRecipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await Promise.all(
    recipeRecords.map(async ({ recipe, savedAt }) => {
      const [recipeDataRecord, categories] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
        }),

        getRecipeCategories(recipe.id),
      ]);

      return {
        categories,
        hasVerifiedVersion: true,
        recipe,
        recipeData: recipeDataRecord,
        savedAt,
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
