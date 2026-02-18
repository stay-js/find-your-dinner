import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const isAdminSchema = z.object({ isAdmin: z.boolean() });

export const categoriesSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(128),
  }),
);

export const ingredientsSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(256),
  }),
);

export const unitsSchema = z.array(
  z.object({
    abbreviation: z.string().min(1).max(16),
    id: z.number().int().positive(),
    name: z.string().min(1).max(64),
  }),
);

export const recipeWithoutIngredientSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(128),
    }),
  ),
  hasVerifiedVersion: z.boolean(),
  recipe: z.object({
    createdAt: z.coerce.date(),
    id: z.number().int().positive(),
    userId: z.string().min(1),
  }),
  recipeData: z.object({
    cookTimeMinutes: z.number().int().positive(),
    createdAt: z.coerce.date(),
    description: z.string().trim().min(1),
    id: z.number().int().positive(),
    instructions: z.string().trim().min(1),
    prepTimeMinutes: z.number().int().positive(),
    previewImageUrl: z.url().trim().max(2048),
    recipeId: z.number().int().positive(),
    servings: z.number().int().positive(),
    title: z.string().trim().min(1).max(512),
    updatedAt: z.coerce.date(),
    verified: z.boolean(),
  }),
});

export type RecipeWithoutIngredients = z.infer<typeof recipeWithoutIngredientSchema>;

export const savedRecipeSchema = recipeWithoutIngredientSchema.extend({
  savedAt: z.coerce.date(),
});

export type SavedRecipe = z.infer<typeof savedRecipeSchema>;

export const savedRecipesSchema = z.array(savedRecipeSchema);

export type SavedRecipes = z.infer<typeof savedRecipesSchema>;

export const recipeSchema = recipeWithoutIngredientSchema.extend({
  author: z.object({
    firstName: z.string().nullable(),
    id: z.string().min(1),
    lastName: z.string().nullable(),
  }),
  ingredients: z.array(
    z.object({
      ingredient: z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(256),
      }),
      quantity: z.number().positive(),
      unit: z.object({
        abbreviation: z.string().min(1).max(16),
        id: z.number().int().positive(),
        name: z.string().min(1).max(64),
      }),
    }),
  ),
});

export type Recipe = z.infer<typeof recipeSchema>;

export const recipesSchema = z.array(recipeWithoutIngredientSchema);

export type Recipes = z.infer<typeof recipesSchema>;

export const savedRecipeIdsSchema = z.array(
  z.object({
    recipeId: z.number().int().positive(),
    savedAt: z.coerce.date(),
  }),
);

export const createUpdateRecipeSchema = z.object({
  categories: z.array(z.number().int().positive()).min(1),
  cookTimeMinutes: z.number().int().positive(),
  description: z.string().trim().min(1),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unitId: z.number().int().positive(),
      }),
    )
    .min(1),
  instructions: z.string().trim().min(1),
  prepTimeMinutes: z.number().int().positive(),
  previewImageUrl: z.url().trim().max(2048),
  servings: z.number().int().positive(),
  title: z.string().trim().min(1).max(512),
});

export type CreateUpdateRecipeSchema = z.infer<typeof createUpdateRecipeSchema>;
