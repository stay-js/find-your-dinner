import { auth } from '@clerk/nextjs/server';
import { asc, desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateCategorySchema } from '~/lib/zod';
import { db } from '~/server/db';
import { categories } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { isPgUniqueViolation } from '~/server/utils/is-pg-unique-violation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();
  const hasQuery = searchQuery && searchQuery.length >= 3;

  const searchWhereClause = hasQuery
    ? sql`(
        to_tsvector('hungarian', ${categories.name}) @@ plainto_tsquery('hungarian', ${searchQuery})
        OR word_similarity(${categories.name}, ${searchQuery}) > 0.3
      )`
    : undefined;

  const similarityOrder = hasQuery
    ? sql<number>`word_similarity(${categories.name}, ${searchQuery})`
    : undefined;

  const result = await db
    .select()
    .from(categories)
    .where(searchWhereClause)
    .orderBy(similarityOrder ? desc(similarityOrder) : asc(categories.name));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const body = await request.json();
  const result = createUpdateCategorySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { name } = result.data;

  try {
    const insertResult = await db.insert(categories).values({ name }).returning();
    const categoryId = insertResult.at(0)?.id;

    if (!categoryId) throw new Error('Failed to insert category');

    return NextResponse.json({ categoryId, message: 'Created' }, { status: 201 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
    }

    console.error(err);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}
