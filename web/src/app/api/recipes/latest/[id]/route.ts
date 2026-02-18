import { auth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { idParamSchema } from '~/lib/zod';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipe } from '~/server/utils/get-recipe';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const recipe = await getRecipe(id, true);

  const isAdmin = await checkIsAdmin(userId);

  if (recipe.recipe.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  return NextResponse.json(recipe);
}
