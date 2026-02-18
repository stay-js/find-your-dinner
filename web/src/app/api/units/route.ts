import { NextResponse } from 'next/server';

import { db } from '~/server/db';

export async function GET() {
  const units = await db.query.units.findMany();
  return NextResponse.json(units);
}
