import {
  admins,
  categories,
  categoryRecipe,
  defaultIngredients,
  ingredientRecipeData,
  ingredients,
  recipeData,
  recipes,
  savedRecipes,
  units,
} from '~/server/db/schema';

import { testDb } from './db';

export async function seedAdmin(userId: string) {
  await testDb.insert(admins).values({ userId }).onConflictDoNothing();
}

export async function seedCategory(name: string) {
  const [category] = await testDb.insert(categories).values({ name }).returning();
  return category;
}

export async function seedDefaultIngredients(userId: string, ingredientIds: number[]) {
  if (ingredientIds.length === 0) return;

  await testDb
    .insert(defaultIngredients)
    .values(ingredientIds.map((ingredientId) => ({ ingredientId, userId })));
}

export async function seedIngredient(name: string) {
  const [ingredient] = await testDb.insert(ingredients).values({ name }).returning();
  return ingredient;
}

export async function seedRecipe(
  userId: string,
  data: Omit<typeof recipeData.$inferInsert, 'recipeId'>,
  categoryIds: number[],
  ingredientEntries: Omit<typeof ingredientRecipeData.$inferInsert, 'recipeDataId'>[],
) {
  return testDb.transaction(async (tx) => {
    const [recipe] = await tx.insert(recipes).values({ userId }).returning();
    if (!recipe) throw new Error('Failed to insert recipe');

    const [recipeDataInsert] = await tx
      .insert(recipeData)
      .values({ recipeId: recipe.id, ...data })
      .returning();
    if (!recipeDataInsert) throw new Error('Failed to insert recipe data');

    if (categoryIds.length > 0) {
      await tx
        .insert(categoryRecipe)
        .values(categoryIds.map((categoryId) => ({ categoryId, recipeId: recipe.id })));
    }

    if (ingredientEntries.length > 0) {
      await tx
        .insert(ingredientRecipeData)
        .values(
          ingredientEntries.map((entry) => ({ recipeDataId: recipeDataInsert.id, ...entry })),
        );
    }

    return { recipe, recipeData: recipeDataInsert };
  });
}

export async function seedSavedRecipe(userId: string, recipeId: number) {
  await testDb.insert(savedRecipes).values({ recipeId, userId });
}

export async function seedUnit(name: string, abbreviation = name.at(0) ?? 'u') {
  const [unit] = await testDb.insert(units).values({ abbreviation, name }).returning();
  return unit;
}

export const SAMPLE_RECIPE_DATA = {
  title: 'Test Recipe',

  description: 'A test recipe description',
  instructions: 'Test instructions',

  previewImageUrl: 'https://example.com/image.jpg',

  cookTimeMinutes: 30,
  prepTimeMinutes: 15,

  servings: 4,

  verified: true,
} satisfies Omit<typeof recipeData.$inferInsert, 'recipeId'>;
