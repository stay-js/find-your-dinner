import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { idParamSchema } from '~/lib/zod-schemas';
import { db } from '~/server/db';
import { savedRecipes } from '~/server/db/schema';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, error: 'INVALID_RECIPE_ID' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  await db
    .delete(savedRecipes)
    .where(and(eq(savedRecipes.userId, userId), eq(savedRecipes.recipeId, id)));

  return new Response(null, { status: 204 });
}
