import { pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).notNull().unique(),
}));

export const recipes = pgTable('recipes', (d) => ({
  id: d.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: d.varchar('user_id', { length: 256 }).notNull(),

  createdAt: d.timestamp('created_at').defaultNow(),
}));

export const recipeData = pgTable('recipe_data', (d) => ({
  id: d.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  recipeId: d
    .bigint('recipe_id', { mode: 'number' })
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

  description: d.text('description').notNull(),
  instructions: d.text('instructions').notNull(),
  title: d.varchar('title', { length: 512 }).notNull(),

  previewImageUrl: d.varchar('preview_image_url', { length: 2048 }).notNull(),

  cookTimeMinutes: d.integer('cook_time_minutes').notNull(),
  prepTimeMinutes: d.integer('prep_time_minutes').notNull(),

  servings: d.integer('servings').notNull(),

  verified: d.boolean('verified').default(false).notNull(),

  createdAt: d.timestamp('created_at').defaultNow(),
  updatedAt: d
    .timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
}));

export const units = pgTable('units', (d) => ({
  id: d.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

  abbreviation: d.varchar('abbreviation', { length: 16 }).notNull(),
  name: d.varchar('name', { length: 64 }).notNull().unique(),
}));

export const ingredients = pgTable('ingredients', (d) => ({
  id: d.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

  name: d.varchar('name', { length: 256 }).notNull().unique(),
}));

export const ingredientRecipeData = pgTable(
  'ingredient_recipe_data',
  (d) => ({
    ingredientId: d
      .bigint('ingredient_id', { mode: 'number' })
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    recipeDataId: d
      .bigint('recipe_data_id', { mode: 'number' })
      .notNull()
      .references(() => recipeData.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    unitId: d
      .bigint('unit_id', { mode: 'number' })
      .notNull()
      .references(() => units.id, { onDelete: 'restrict', onUpdate: 'restrict' }),

    quantity: d.doublePrecision('quantity').notNull(),
  }),
  (t) => [primaryKey({ columns: [t.recipeDataId, t.ingredientId] })],
);

export const categories = pgTable('categories', (d) => ({
  id: d.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

  name: d.varchar('name', { length: 128 }).notNull().unique(),
}));

export const categoryRecipe = pgTable(
  'category_recipe',
  (d) => ({
    categoryId: d
      .bigint('category_id', { mode: 'number' })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    recipeId: d
      .bigint('recipe_id', { mode: 'number' })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  }),
  (t) => [primaryKey({ columns: [t.recipeId, t.categoryId] })],
);

export const savedRecipes = pgTable(
  'saved_recipes',
  (d) => ({
    recipeId: d
      .bigint('recipe_id', { mode: 'number' })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: d.varchar('user_id', { length: 256 }).notNull(),

    createdAt: d.timestamp('created_at').defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.recipeId] })],
);
