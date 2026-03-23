import { auth } from '@clerk/nextjs/server';
import { and, countDistinct, desc, eq, inArray, notExists, notInArray } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  boolFlagSearchSchema,
  createUpdateRecipeSchema,
  idArraySearchSchema,
  isPositiveIntegerString,
  type PaginationMeta,
} from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, ingredientRecipeData, recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import {
  buildFtsClause,
  buildLatestRecipeData,
  buildRecipeDataJoinClause,
  enrichRecipes,
} from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

const getRecipesSchema = z.object({
  allowUnverified: boolFlagSearchSchema,
  categories: idArraySearchSchema,
  ingredients: idArraySearchSchema,
  onlyAwaitingVerification: boolFlagSearchSchema,
  perPage: z
    .string()
    .refine(isPositiveIntegerString)
    .default(PAGE_SIZE.toString())
    .catch(PAGE_SIZE.toString())
    .transform((val) => Math.min(100, Math.max(1, Number(val)))),
  query: z.string().trim().nullable().catch(null),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { data: params, success } = getRecipesSchema.safeParse({
    allowUnverified: searchParams.get('allow-unverified'),
    categories: searchParams.get('categories'),
    ingredients: searchParams.get('ingredients'),
    onlyAwaitingVerification: searchParams.get('only-awaiting-verification'),
    perPage: searchParams.get('per-page'),
    query: searchParams.get('query'),
  });

  if (!success) {
    return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
  }

  const onlyAwaitingVerification = params.onlyAwaitingVerification;
  const allowUnverified = onlyAwaitingVerification || params.allowUnverified;
  const categoryIds = params.categories;
  const ingredientIds = params.ingredients;

  const searchWhereClause = buildFtsClause(params.query);

  if (allowUnverified) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) return unauthorized();

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) return forbidden();
  }

  const verifiedOnly = !allowUnverified;
  const latestRd = buildLatestRecipeData(verifiedOnly);
  const joinClause = buildRecipeDataJoinClause(latestRd, {
    onlyAwaitingVerification,
    verifiedOnly,
  });

  const categoryWhereClause =
    categoryIds.length === 0 ? undefined : inArray(categoryRecipe.categoryId, categoryIds);

  const ingredientWhereClause =
    ingredientIds.length === 0
      ? undefined
      : notExists(
          db
            .select({ id: ingredientRecipeData.ingredientId })
            .from(ingredientRecipeData)
            .where(
              and(
                eq(ingredientRecipeData.recipeDataId, recipeData.id),
                notInArray(ingredientRecipeData.ingredientId, ingredientIds),
              ),
            ),
        );

  const baseCountQuery = db
    .select({ count: countDistinct(recipes.id) })
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

  const [totalResult] = await baseCountQuery.where(and(searchWhereClause, ingredientWhereClause));
  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, params.perPage);

  const recipeRecords = await baseRecipesQuery
    .where(and(searchWhereClause, ingredientWhereClause))
    .groupBy(recipes.id)
    .orderBy(desc(recipes.createdAt))
    .limit(params.perPage)
    .offset((page - 1) * params.perPage);

  const result = await enrichRecipes(recipeRecords, { onlyAwaitingVerification, verifiedOnly });

  return NextResponse.json({
    data: result,
    meta: {
      currentPage: page,
      pageCount,
      perPage: params.perPage,
      total,
    } satisfies PaginationMeta,
  });
}

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const body = await request.json();
  const result = createUpdateRecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { categories, ingredients, ...data } = result.data;

  try {
    const recipeId = await db.transaction(async (tx) => {
      const recipeInsertResult = await tx
        .insert(recipes)
        .values({ userId })
        .returning({ id: recipes.id });

      const recipeId = recipeInsertResult.at(0)?.id;
      if (!recipeId) throw new Error('Failed to insert recipe');

      const recipeDataInsertResult = await tx
        .insert(recipeData)
        .values({ recipeId, ...data })
        .returning({ id: recipeData.id });

      const recipeDataId = recipeDataInsertResult.at(0)?.id;
      if (!recipeDataId) throw new Error('Failed to insert recipe data');

      await tx
        .insert(categoryRecipe)
        .values(categories.map((categoryId) => ({ categoryId, recipeId })));

      await tx
        .insert(ingredientRecipeData)
        .values(ingredients.map((ingredient) => ({ recipeDataId, ...ingredient })));

      return recipeId;
    });

    return NextResponse.json({ message: 'Created', recipeId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to create recipe' }, { status: 500 });
  }
}
