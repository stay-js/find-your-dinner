import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { idParamSchema } from '~/lib/zod-schemas';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { error: 'INVALID_RECIPE_DATA_ID', details: result.error },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipeDataRecord = await db.query.recipeData.findFirst({ where: eq(recipeData.id, id) });

  if (!recipeDataRecord) {
    return NextResponse.json({ error: 'RECIPE_DATA_NOT_FOUND' }, { status: 404 });
  }

  if (recipeDataRecord.verified) {
    return NextResponse.json({ error: 'RECIPE_DATA_ALREADY_VERIFIED' }, { status: 400 });
  }

  await db.update(recipeData).set({ verified: true }).where(eq(recipeData.id, id));

  return new Response(null, { status: 204 });
}
