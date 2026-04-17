import { z } from 'zod';

import { createPaginatedSchema } from './helpers';

export const findPageStateSchema = z
  .enum(['filter', 'swipe', 'tournament'])
  .optional()
  .default('filter')
  .catch('filter');
export type FindPageState = z.infer<typeof findPageStateSchema>;

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export type IdParam = z.infer<typeof idParamSchema>;

export const idArraySearchSchema = z
  .string()
  .nullable()
  .transform((val) => {
    if (!val) return [];

    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  })
  .pipe(z.array(z.number().int().positive()))
  .catch([]);

export const boolFlagSearchSchema = z
  .string()
  .nullable()
  .transform((val) => val === '1' || val === 'true')
  .catch(false);

export const pageSchema = z.coerce.number().int().positive().optional().default(1).catch(1);

export const isAdminSchema = z.object({ isAdmin: z.boolean() });
export type IsAdmin = z.infer<typeof isAdminSchema>;

export const authorSchema = z.object({
  id: z.string().min(1),

  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});
export type Author = z.infer<typeof authorSchema>;

export const categorySchema = z.object({
  id: z.number().int().positive(),

  name: z.string().min(1).max(128),

  canBeDeleted: z.boolean(),
});
export type Category = z.infer<typeof categorySchema>;

export const categoriesSchema = z.array(categorySchema);
export type Categories = z.infer<typeof categoriesSchema>;

export const ingredientSchema = z.object({
  id: z.number().int().positive(),

  name: z.string().min(1).max(256),

  canBeDeleted: z.boolean(),
});
export type Ingredient = z.infer<typeof ingredientSchema>;

export const ingredientsSchema = z.array(ingredientSchema);
export type Ingredients = z.infer<typeof ingredientsSchema>;

export const unitSchema = z.object({
  id: z.number().int().positive(),

  abbreviation: z.string().min(1).max(16),
  name: z.string().min(1).max(64),
});
export type Unit = z.infer<typeof unitSchema>;

export const unitsSchema = z.array(unitSchema);
export type Units = z.infer<typeof unitsSchema>;

export const ingredientWithPivotSchema = z.object({
  ingredient: ingredientSchema,
  quantity: z.number().positive(),
  unit: unitSchema,
});
export type IngredientWithPivot = z.infer<typeof ingredientWithPivotSchema>;

export const ingredientsWithPivotSchema = z.array(ingredientWithPivotSchema);
export type IngredientsWithPivot = z.infer<typeof ingredientsWithPivotSchema>;

export const recipeDataSchema = z.object({
  id: z.number().int().positive(),
  recipeId: z.number().int().positive(),

  description: z.string().trim().min(1),
  instructions: z.string().trim().min(1),
  title: z.string().trim().min(1).max(512),

  previewImageUrl: z.url().trim().max(2048),

  cookTimeMinutes: z.number().int().positive(),
  prepTimeMinutes: z.number().int().positive(),

  servings: z.number().int().positive(),

  verified: z.boolean(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type RecipeData = z.infer<typeof recipeDataSchema>;

export const recipeSchema = z.object({
  recipe: z.object({
    id: z.number().int().positive(),
    userId: z.string().min(1),

    createdAt: z.coerce.date(),
  }),

  recipeData: recipeDataSchema,

  categories: z.array(categorySchema.omit({ canBeDeleted: true })),

  hasVerifiedVersion: z.boolean(),
});
export type Recipe = z.infer<typeof recipeSchema>;

export const recipesSchema = z.array(recipeSchema);
export type Recipes = z.infer<typeof recipesSchema>;

export const paginatedRecipesSchema = createPaginatedSchema(recipeSchema);
export type PaginatedRecipes = z.infer<typeof paginatedRecipesSchema>;

export const fullRecipeSchema = recipeSchema.extend({
  author: authorSchema,
  ingredients: ingredientsWithPivotSchema,
});
export type FullRecipe = z.infer<typeof fullRecipeSchema>;

export const savedRecipeIdsSchema = z.array(
  z.object({
    recipeId: z.number().int().positive(),

    savedAt: z.coerce.date(),
  }),
);
export type SavedRecipeIds = z.infer<typeof savedRecipeIdsSchema>;

export const createUpdateRecipeSchema = z.object({
  description: z.string().trim().min(1),
  instructions: z.string().trim().min(1),
  title: z.string().trim().min(1).max(512),

  previewImageUrl: z
    .url()
    .trim()
    .max(2048)
    .refine((url) => url.startsWith('https://'), {
      error: 'URL must start with https://',
    }),

  cookTimeMinutes: z.number().int().positive(),
  prepTimeMinutes: z.number().int().positive(),

  servings: z.number().int().positive(),

  categories: z.array(z.number().int().positive()).min(1),

  ingredients: z
    .array(
      z.object({
        ingredientId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unitId: z.number().int().positive(),
      }),
    )
    .min(1),
});
export type CreateUpdateRecipeSchema = z.infer<typeof createUpdateRecipeSchema>;

export const createSavedRecipeSchema = z.object({
  recipeId: z.number().int().positive(),
});
export type CreateSavedRecipeSchema = z.infer<typeof createSavedRecipeSchema>;

export const defaultIngredientIdsSchema = z.array(z.number().int().positive());
export type DefaultIngredientIds = z.infer<typeof defaultIngredientIdsSchema>;

export const createUpdateCategorySchema = z.object({
  name: z.string().min(1).max(128),
});
export type CreateUpdateCategorySchema = z.infer<typeof createUpdateCategorySchema>;

export const createUpdateIngredientSchema = z.object({
  name: z.string().min(1).max(256),
});
export type CreateUpdateIngredientSchema = z.infer<typeof createUpdateIngredientSchema>;

export const createUpdateUnitSchema = z.object({
  abbreviation: z.string().min(1).max(16),
  name: z.string().min(1).max(64),
});
export type CreateUpdateUnitSchema = z.infer<typeof createUpdateUnitSchema>;
