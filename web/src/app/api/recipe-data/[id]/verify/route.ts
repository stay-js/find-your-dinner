import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { idParamSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { recipeData } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, notFound, unauthorized } from '~/server/utils/errors';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid recipe data id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const recipeDataRecord = await db.query.recipeData.findFirst({ where: eq(recipeData.id, id) });
  if (!recipeDataRecord) return notFound();

  if (recipeDataRecord.verified) {
    return NextResponse.json({ message: 'Recipe data already verified' }, { status: 409 });
  }

  try {
    await db.update(recipeData).set({ verified: true }).where(eq(recipeData.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to verify recipe data' }, { status: 500 });
  }
}
