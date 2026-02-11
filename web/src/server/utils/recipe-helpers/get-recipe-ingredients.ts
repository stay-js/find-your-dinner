import { eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { ingredientRecipeData, ingredients, units } from '~/server/db/schema';

export function getRecipeIngredients(recipeDataId: number) {
  return db
    .select({
      ingredient: ingredients,
      quantity: ingredientRecipeData.quantity,
      unit: units,
    })
    .from(ingredientRecipeData)
    .innerJoin(ingredients, eq(ingredients.id, ingredientRecipeData.ingredientId))
    .innerJoin(units, eq(units.id, ingredientRecipeData.unitId))
    .where(eq(ingredientRecipeData.recipeDataId, recipeDataId));
}
