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

export const recipeSchema = z.object({
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

export type Recipe = z.infer<typeof recipeSchema>;

export const recipesSchema = z.array(recipeSchema);

export type Recipes = z.infer<typeof recipesSchema>;

export const savedRecipesSchema = z.array(
  z.object({
    recipeId: z.number().int().positive(),
    userId: z.string().min(1),
    createdAt: z.coerce.date(),
  }),
);
