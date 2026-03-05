import { sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { categories } from '~/server/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();

  const ftsWhereClause = searchQuery
    ? sql`to_tsvector('hungarian', ${categories.name}) @@ plainto_tsquery('hungarian', ${searchQuery})`
    : undefined;

  const result = await db.select().from(categories).where(ftsWhereClause);
  return NextResponse.json(result);
}
