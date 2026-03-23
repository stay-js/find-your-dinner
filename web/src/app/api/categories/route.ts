import { asc, desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { categories } from '~/server/db/schema';

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
