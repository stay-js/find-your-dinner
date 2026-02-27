import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, max } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateRecipeSchema, type PaginationMeta } from '~/lib/zod';
import { db } from '~/server/db';
import { categoryRecipe, ingredientRecipeData, recipeData, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getPagination } from '~/server/utils/get-pagination';
import { getHasVerifiedVersion, getRecipeCategories } from '~/server/utils/recipe-helpers';

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const allowUnverified = ['1', 'true'].includes(searchParams.get('allow-unverified') ?? '');

  if (allowUnverified) {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) return unauthorized();

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) return forbidden();
  }

  const latestRecipeData = db
    .select({
      latestCreatedAt: max(recipeData.createdAt).as('latestCreatedAt'),
      recipeId: recipeData.recipeId,
    })
    .from(recipeData)
    .where(allowUnverified ? undefined : eq(recipeData.verified, true))
    .groupBy(recipeData.recipeId)
    .as('latestRecipeData');

  const joinClause = and(
    eq(recipeData.recipeId, latestRecipeData.recipeId),
    eq(recipeData.createdAt, latestRecipeData.latestCreatedAt),
    allowUnverified ? undefined : eq(recipeData.verified, true),
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
          where: allowUnverified
            ? eq(recipeData.recipeId, recipe.id)
            : and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true)),
        }),

        getRecipeCategories(recipe.id),
        allowUnverified ? getHasVerifiedVersion(recipe.id) : true,
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
