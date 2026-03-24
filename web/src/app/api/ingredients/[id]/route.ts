import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { createUpdateIngredientSchema, idParamSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { ingredients } from '~/server/db/schema';
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
      { details: result.error, message: 'Invalid ingredient id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const ingredient = await db.query.ingredients.findFirst({ where: eq(ingredients.id, id) });
  if (!ingredient) return notFound();

  try {
    await db.delete(ingredients).where(eq(ingredients.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to delete ingredient' }, { status: 500 });
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
      { details: result.error, message: 'Invalid ingredient id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const body = await request.json();
  const bodyResult = createUpdateIngredientSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      { details: bodyResult.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const ingredient = await db.query.ingredients.findFirst({ where: eq(ingredients.id, id) });
  if (!ingredient) return notFound();

  const { name } = bodyResult.data;

  try {
    await db.update(ingredients).set({ name }).where(eq(ingredients.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json({ message: 'Ingredient already exists' }, { status: 409 });
    }

    console.error(err);
    return NextResponse.json({ message: 'Failed to update ingredient' }, { status: 500 });
  }
}
