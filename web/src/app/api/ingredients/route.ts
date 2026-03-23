import { asc, desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { ingredients } from '~/server/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();
  const hasQuery = searchQuery && searchQuery.length >= 3;

  const searchWhereClause = hasQuery
    ? sql`(
        to_tsvector('hungarian', ${ingredients.name}) @@ plainto_tsquery('hungarian', ${searchQuery})
        OR word_similarity(${ingredients.name}, ${searchQuery}) > 0.3
      )`
    : undefined;

  const similarityOrder = hasQuery
    ? sql<number>`word_similarity(${ingredients.name}, ${searchQuery})`
    : undefined;

  const result = await db
    .select()
    .from(ingredients)
    .where(searchWhereClause)
    .orderBy(similarityOrder ? desc(similarityOrder) : asc(ingredients.name));

  return NextResponse.json(result);
}
