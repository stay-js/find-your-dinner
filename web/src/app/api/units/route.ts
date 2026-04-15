import { auth } from '@clerk/nextjs/server';
import { asc, desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateUnitSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { units } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { isPgUniqueViolation } from '~/server/utils/is-pg-unique-violation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();
  const hasQuery = searchQuery && searchQuery.length > 0;

  const searchWhereClause = hasQuery
    ? sql`(
        (
          setweight(to_tsvector('hungarian', ${units.name}), 'A') ||
          setweight(to_tsvector('hungarian', ${units.abbreviation}), 'B')
        ) @@ plainto_tsquery('hungarian', ${searchQuery})
        OR word_similarity(${units.name}, ${searchQuery}) > 0.3
        OR word_similarity(${units.abbreviation}, ${searchQuery}) > 0.3
      )`
    : undefined;

  const similarityOrder = hasQuery
    ? sql<number>`greatest(word_similarity(${units.name}, ${searchQuery}), word_similarity(${units.abbreviation}, ${searchQuery}))`
    : undefined;

  const result = await db
    .select()
    .from(units)
    .where(searchWhereClause)
    .orderBy(similarityOrder ? desc(similarityOrder) : asc(units.name));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const body = await request.json();
  const result = createUpdateUnitSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { abbreviation, name } = result.data;

  try {
    const insertResult = await db.insert(units).values({ abbreviation, name }).returning();
    const unitId = insertResult.at(0)?.id;

    if (!unitId) throw new Error('Failed to insert unit');

    return NextResponse.json({ message: 'Created', unitId }, { status: 201 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json({ message: 'Unit already exists' }, { status: 409 });
    }

    console.error(err);
    return NextResponse.json({ message: 'Failed to create unit' }, { status: 500 });
  }
}
