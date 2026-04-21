import { auth } from '@clerk/nextjs/server';
import { asc, desc, getTableColumns, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateIngredientSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { defaultIngredients, ingredientRecipeData, ingredients } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { isPgUniqueViolation } from '~/server/utils/is-pg-unique-violation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();
  const hasQuery = searchQuery && searchQuery.length > 0;

  const searchWhereClause = hasQuery
    ? sql`(
        to_tsvector('hungarian', ${ingredients.name}) @@ plainto_tsquery('hungarian', ${searchQuery})
        OR word_similarity(${ingredients.name}, ${searchQuery}) > 0.3
      )`
    : undefined;

  const similarityOrder = hasQuery
    ? sql<number>`word_similarity(${ingredients.name}, ${searchQuery})`
    : undefined;

  const canBeDeletedExpr = sql<boolean>`
    NOT EXISTS (SELECT 1 FROM ${ingredientRecipeData} WHERE ${ingredientRecipeData.ingredientId} = ${ingredients.id})
    AND NOT EXISTS (SELECT 1 FROM ${defaultIngredients} WHERE ${defaultIngredients.ingredientId} = ${ingredients.id})
  `;

  const result = await db
    .select({ ...getTableColumns(ingredients), canBeDeleted: canBeDeletedExpr })
    .from(ingredients)
    .where(searchWhereClause)
    .orderBy(similarityOrder ? desc(similarityOrder) : asc(ingredients.name));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const body = await request.json();
  const result = createUpdateIngredientSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { name } = result.data;

  try {
    const [insertResult] = await db
      .insert(ingredients)
      .values({ name })
      .returning({ id: ingredients.id });

    const ingredientId = insertResult?.id;
    if (!ingredientId) throw new Error('Failed to insert ingredient');

    return NextResponse.json({ ingredientId, message: 'Created' }, { status: 201 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json({ message: 'Ingredient already exists' }, { status: 409 });
    }

    console.error(err);
    return NextResponse.json({ message: 'Failed to create ingredient' }, { status: 500 });
  }
}
