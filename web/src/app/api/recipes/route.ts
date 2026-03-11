import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  boolFlagSearchSchema,
  categoriesSearchSchema,
  createUpdateRecipeSchema,
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
  'allow-unverified': boolFlagSearchSchema,
  'awaiting-verification': boolFlagSearchSchema,
  categories: categoriesSearchSchema,
  query: z.string().trim().nullable().catch(null),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { data: params, success } = getRecipesSchema.safeParse({
    'allow-unverified': searchParams.get('allow-unverified'),
    'awaiting-verification': searchParams.get('awaiting-verification'),
    categories: searchParams.get('categories'),
    query: searchParams.get('query'),
  });

  if (!success) {
    return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
  }

  const awaitingVerification = params['awaiting-verification'];
  const allowUnverified = awaitingVerification || params['allow-unverified'];
  const categoryIds = params.categories?.length ? params.categories : undefined;

  const ftsWhereClause = buildFtsClause(params.query);

  if (allowUnverified) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) return unauthorized();

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) return forbidden();
  }

  const verifiedOnly = !allowUnverified;
  const latestRd = buildLatestRecipeData(verifiedOnly);
  const joinClause = buildRecipeDataJoinClause(latestRd, { awaitingVerification, verifiedOnly });

  const categoryWhereClause =
    categoryIds && categoryIds.length > 0
      ? inArray(categoryRecipe.categoryId, categoryIds)
      : undefined;

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

  const [totalResult] = await baseCountQuery.where(ftsWhereClause);
  const total = totalResult?.count ?? 0;

  const { page, pageCount } = getPagination(searchParams.get('page'), total, PAGE_SIZE);

  const recipeRecords = await baseRecipesQuery
    .where(ftsWhereClause)
    .orderBy(desc(recipes.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const result = await enrichRecipes(recipeRecords, { awaitingVerification, verifiedOnly });

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
