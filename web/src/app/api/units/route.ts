import { sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '~/server/db';
import { units } from '~/server/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get('query')?.trim();

  const ftsWhereClause = searchQuery
    ? sql`(
          setweight(to_tsvector('hungarian', ${units.name}), 'A') ||
          setweight(to_tsvector('hungarian', ${units.abbreviation}), 'B')
        ) @@ plainto_tsquery('hungarian', ${searchQuery})`
    : undefined;

  const result = await db.select().from(units).where(ftsWhereClause);
  return NextResponse.json(result);
}
