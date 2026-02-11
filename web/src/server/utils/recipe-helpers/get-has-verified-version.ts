import { and, count, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData } from '~/server/db/schema';

export async function getHasVerifiedVersion(recipeId: number) {
  const countResult = await db
    .select({ count: count() })
    .from(recipeData)
    .where(and(eq(recipeData.recipeId, recipeId), eq(recipeData.verified, true)));

  return (countResult?.[0]?.count ?? 0) > 0;
}
