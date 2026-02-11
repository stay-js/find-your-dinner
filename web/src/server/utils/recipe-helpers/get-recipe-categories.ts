import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { categories, categoryRecipe } from '~/server/db/schema';

export function getRecipeCategories(recipeId: number) {
  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categoryRecipe)
    .innerJoin(categories, eq(categories.id, categoryRecipe.categoryId))
    .where(eq(categoryRecipe.recipeId, recipeId));
}
