import { pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).notNull().unique(),
}));

export const recipes = pgTable('recipes', (d) => ({
  id: d.bigserial('id', { mode: 'number' }).primaryKey(),
  userId: d.varchar('user_id', { length: 256 }).notNull(),
  createdAt: d.timestamp('created_at').defaultNow(),
}));

export const recipeData = pgTable('recipe_data', (d) => ({
  id: d.bigserial('id', { mode: 'number' }).primaryKey(),
  recipeId: d
    .bigserial('recipe_id', { mode: 'number' })
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  title: d.varchar('title', { length: 512 }).notNull(),
  previewImageUrl: d.varchar('preview_image_url', { length: 2048 }).notNull(),
  description: d.text('description').notNull(),
  instructions: d.text('instructions').notNull(),
  prepTimeMinutes: d.integer('prep_time_minutes').notNull(),
  cookTimeMinutes: d.integer('cook_time_minutes').notNull(),
  servings: d.integer('servings').notNull(),
  verified: d.boolean('verified').default(false).notNull(),
  createdAt: d.timestamp('created_at').defaultNow(),
  updatedAt: d
    .timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
}));

export const units = pgTable('units', (d) => ({
  id: d.bigserial('id', { mode: 'number' }).primaryKey(),
  name: d.varchar('name', { length: 64 }).notNull().unique(),
  abbreviation: d.varchar('abbreviation', { length: 16 }).notNull(),
}));

export const ingredients = pgTable('ingredients', (d) => ({
  id: d.bigserial('id', { mode: 'number' }).primaryKey(),
  name: d.varchar('name', { length: 256 }).notNull().unique(),
}));

export const ingredientRecipeData = pgTable(
  'ingredient_recipe_data',
  (d) => ({
    recipeDataId: d
      .bigserial('recipe_data_id', { mode: 'number' })
      .notNull()
      .references(() => recipeData.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ingredientId: d
      .bigserial('ingredient_id', { mode: 'number' })
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    quantity: d.doublePrecision('quantity').notNull(),
    unitId: d
      .bigserial('unit_id', { mode: 'number' })
      .notNull()
      .references(() => units.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  }),
  (t) => [primaryKey({ columns: [t.recipeDataId, t.ingredientId] })],
);

export const categories = pgTable('categories', (d) => ({
  id: d.bigserial('id', { mode: 'number' }).primaryKey(),
  name: d.varchar('name', { length: 128 }).notNull().unique(),
}));

export const categoryRecipe = pgTable(
  'category_recipe',
  (d) => ({
    recipeId: d
      .bigserial('recipe_id', { mode: 'number' })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    categoryId: d
      .bigserial('category_id', { mode: 'number' })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  }),
  (t) => [primaryKey({ columns: [t.recipeId, t.categoryId] })],
);

export const savedRecipes = pgTable(
  'saved_recipes',
  (d) => ({
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    recipeId: d
      .bigserial('recipe_id', { mode: 'number' })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: d.timestamp('created_at').defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.recipeId] })],
);
