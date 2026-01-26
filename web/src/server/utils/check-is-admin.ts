import { eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { admins } from '~/server/db/schema';

export async function checkIsAdmin(userId: string | null | undefined) {
  if (!userId) return false;

  const isAdmin = await db.query.admins.findFirst({ where: eq(admins.userId, userId) });

  return !!isAdmin;
}
