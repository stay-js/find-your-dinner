import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '~/server/db';
import { defaultIngredients } from '~/server/db/schema';
import { unauthorized } from '~/server/utils/errors';

const updateDefaultIngredientsSchema = z.object({
  ingredientIds: z.array(z.number().int().positive()),
});

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const result = await db
    .select({ ingredientId: defaultIngredients.ingredientId })
    .from(defaultIngredients)
    .where(eq(defaultIngredients.userId, userId));

  return NextResponse.json(result.map(({ ingredientId }) => ingredientId));
}

export async function PUT(request: NextRequest) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const body = await request.json();
  const result = updateDefaultIngredientsSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { ingredientIds } = result.data;

  await db.transaction(async (tx) => {
    await tx.delete(defaultIngredients).where(eq(defaultIngredients.userId, userId));

    if (ingredientIds.length > 0) {
      await tx
        .insert(defaultIngredients)
        .values(ingredientIds.map((ingredientId) => ({ ingredientId, userId })));
    }
  });

  return new NextResponse(null, { status: 204 });
}
