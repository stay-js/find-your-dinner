import { asc, desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { units } from '~/server/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();
  const hasQuery = searchQuery && searchQuery.length >= 3;

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
