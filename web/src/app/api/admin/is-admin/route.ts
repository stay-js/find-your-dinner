import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { checkIsAdmin } from '~/server/utils/check-is-admin';

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'UNAUTHORIZED', isAdmin: false }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(userId);

  return NextResponse.json({ isAdmin });
}
