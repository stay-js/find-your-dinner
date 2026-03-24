import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateUnitSchema, idParamSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { units } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, notFound, unauthorized } from '~/server/utils/errors';
import { isPgUniqueViolation } from '~/server/utils/is-pg-unique-violation';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid unit id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const unit = await db.query.units.findFirst({ where: eq(units.id, id) });
  if (!unit) return notFound();

  try {
    await db.delete(units).where(eq(units.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to delete unit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid unit id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const body = await request.json();
  const bodyResult = createUpdateUnitSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      { details: bodyResult.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const unit = await db.query.units.findFirst({ where: eq(units.id, id) });
  if (!unit) return notFound();

  const { abbreviation, name } = bodyResult.data;

  try {
    await db.update(units).set({ abbreviation, name }).where(eq(units.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json({ message: 'Unit already exists' }, { status: 409 });
    }

    console.error(err);
    return NextResponse.json({ message: 'Failed to update unit' }, { status: 500 });
  }
}
