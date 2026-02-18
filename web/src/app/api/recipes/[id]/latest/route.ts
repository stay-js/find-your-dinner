import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';

import { idParamSchema } from '~/lib/zod';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';
import { getRecipe } from '~/server/utils/get-recipe';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid recipe id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await getRecipe(id, true);
  if (!recipe) notFound();

  const isAdmin = await checkIsAdmin(userId);
  if (recipe.recipe.userId !== userId && !isAdmin) return forbidden();

  return NextResponse.json(recipe);
}
