import { type NextRequest, NextResponse } from 'next/server';

import { getRecipe } from '~/server/utils/get-recipe';
import { idParamSchema } from '~/lib/zod-schemas';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_RECIPE_ID', details: result.error },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipe = await getRecipe(id);

  return NextResponse.json(recipe);
}
