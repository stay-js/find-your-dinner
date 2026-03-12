import { and, desc, eq, max, sql } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData, type recipes } from '~/server/db/schema';

import { getHasVerifiedVersion } from './get-has-verified-version';
import { getRecipeCategories } from './get-recipe-categories';

type RecipeRecord = { recipe: typeof recipes.$inferSelect };

export function buildFtsClause(query: null | string | undefined) {
  return query && query.length >= 3
    ? sql`(
        setweight(to_tsvector('hungarian', ${recipeData.title}), 'A') ||
        setweight(to_tsvector('hungarian', ${recipeData.description}), 'B')
      ) @@ plainto_tsquery('hungarian', ${query})`
    : undefined;
}

export function buildLatestRecipeData(verifiedOnly = false) {
  return db
    .select({
      latestCreatedAt: max(recipeData.createdAt).as('latestCreatedAt'),
      recipeId: recipeData.recipeId,
    })
    .from(recipeData)
    .where(verifiedOnly ? eq(recipeData.verified, true) : undefined)
    .groupBy(recipeData.recipeId)
    .as('latestRecipeData');
}

export function buildRecipeDataJoinClause(
  latestRd: ReturnType<typeof buildLatestRecipeData>,
  opts: { onlyAwaitingVerification?: boolean; verifiedOnly?: boolean } = {},
) {
  return and(
    eq(recipeData.recipeId, latestRd.recipeId),
    eq(recipeData.createdAt, latestRd.latestCreatedAt),
    opts.onlyAwaitingVerification
      ? eq(recipeData.verified, false)
      : opts.verifiedOnly
        ? eq(recipeData.verified, true)
        : undefined,
  );
}

export async function enrichRecipes(
  recipeRecords: RecipeRecord[],
  opts: {
    onlyAwaitingVerification?: boolean;
    verifiedOnly?: boolean;
  } = {},
) {
  return Promise.all(
    recipeRecords.map(async ({ recipe }) => {
      const recipeDataWhere = opts.onlyAwaitingVerification
        ? and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, false))
        : opts.verifiedOnly
          ? and(eq(recipeData.recipeId, recipe.id), eq(recipeData.verified, true))
          : eq(recipeData.recipeId, recipe.id);

      const [recipeDataRecord, categories, hasVerifiedVersion] = await Promise.all([
        db.query.recipeData.findFirst({
          orderBy: desc(recipeData.createdAt),
          where: recipeDataWhere,
        }),
        getRecipeCategories(recipe.id),
        opts.verifiedOnly ? true : getHasVerifiedVersion(recipe.id),
      ]);

      return {
        categories,
        hasVerifiedVersion,
        recipe,
        recipeData: recipeDataRecord,
      };
    }),
  );
}
