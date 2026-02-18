import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { unauthorized } from '~/server/utils/errors';

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return unauthorized({ isAdmin: false });

  const isAdmin = await checkIsAdmin(userId);
  return NextResponse.json({ isAdmin });
}
