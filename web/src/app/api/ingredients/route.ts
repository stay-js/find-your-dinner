import { NextResponse } from 'next/server';

import { db } from '~/server/db';

export async function GET() {
  const ingredients = await db.query.ingredients.findMany();
  return NextResponse.json(ingredients);
}
