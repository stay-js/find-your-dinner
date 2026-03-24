import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';

import { idParamSchema } from '~/lib/zod';
import { db } from '~/server/db';
import { categories } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { forbidden, unauthorized } from '~/server/utils/errors';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) return forbidden();

  const result = idParamSchema.safeParse(await params);

  if (!result.success) {
    return NextResponse.json(
      { details: result.error, message: 'Invalid category id' },
      { status: 400 },
    );
  }

  const { id } = result.data;

  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) notFound();

  await db.delete(categories).where(eq(categories.id, id));

  return new Response(null, { status: 204 });
}
