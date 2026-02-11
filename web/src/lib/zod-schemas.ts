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
    id: z.number().int().positive(),
    name: z.string().min(1).max(64),
    abbreviation: z.string().min(1).max(16),
  }),
);

export const recipeWithoutIngredientSchema = z.object({
  recipe: z.object({
    id: z.number().int().positive(),
    userId: z.string().min(1),
    createdAt: z.coerce.date(),
  }),
  recipeData: z.object({
    id: z.number().int().positive(),
    recipeId: z.number().int().positive(),
    title: z.string().trim().min(1).max(512),
    previewImageUrl: z.url().trim().max(2048),
    description: z.string().trim().min(1),
    instructions: z.string().trim().min(1),
    prepTimeMinutes: z.number().int().positive(),
    cookTimeMinutes: z.number().int().positive(),
    servings: z.number().int().positive(),
    verified: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  categories: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(128),
    }),
  ),
});

export type RecipeWithoutIngredients = z.infer<typeof recipeWithoutIngredientSchema>;

export const recipeSchema = recipeWithoutIngredientSchema.extend({
  ingredients: z.array(
    z.object({
      ingredient: z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(256),
      }),
      quantity: z.number().positive(),
      unit: z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(64),
        abbreviation: z.string().min(1).max(16),
      }),
    }),
  ),
  author: z.object({
    id: z.string().min(1),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
});

export type Recipe = z.infer<typeof recipeSchema>;

export const recipesSchema = z.array(recipeWithoutIngredientSchema);

export type Recipes = z.infer<typeof recipesSchema>;

export const savedRecipesSchema = z.array(
  z.object({
    savedAt: z.coerce.date(),
    recipeId: z.number().int().positive(),
  }),
);

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1).max(512),
  previewImageUrl: z.url().trim().max(2048),
  description: z.string().trim().min(1),
  instructions: z.string().trim().min(1),
  prepTimeMinutes: z.number().int().positive(),
  cookTimeMinutes: z.number().int().positive(),
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

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
