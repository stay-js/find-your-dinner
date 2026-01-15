import { index, primaryKey, mysqlTable as table } from 'drizzle-orm/mysql-core';

export const ingredients = table('ingredients', (d) => ({
  id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: d.varchar('name', { length: 256 }).notNull(),
  unit: d.varchar('unit', { length: 64 }).notNull(),
  createdAt: d.timestamp('created_at').defaultNow(),
  updatedAt: d.timestamp('updated_at').defaultNow().onUpdateNow(),
}));

export const recipes = table('recipes', (d) => ({
  id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  userId: d.varchar('user_id', { length: 256 }).notNull(),
  createdAt: d.timestamp('created_at').defaultNow(),
  updatedAt: d.timestamp('updated_at').defaultNow().onUpdateNow(),
}));

export const recipeData = table(
  'recipe_data',
  (d) => ({
    id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    recipeId: d
      .bigint('recipe_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    title: d.varchar('title', { length: 512 }).notNull(),
    description: d.text('description').notNull(),
    instructions: d.text('instructions').notNull(),
    prepTimeMinutes: d.int('prep_time_minutes', { unsigned: true }).notNull(),
    cookTimeMinutes: d.int('cook_time_minutes', { unsigned: true }).notNull(),
    servings: d.int('servings', { unsigned: true }).notNull(),
    verified: d.boolean('verified').default(false).notNull(),
    createdAt: d.timestamp('created_at').defaultNow(),
    updatedAt: d.timestamp('updated_at').defaultNow().onUpdateNow(),
  }),
  (t) => [index('idx_recipe_data_recipe_id').on(t.recipeId)],
);

export const ingredientRecipeData = table(
  'ingredient_recipe_data',
  (d) => ({
    recipeDataId: d
      .bigint('recipe_data_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => recipeData.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ingredientId: d
      .bigint('ingredient_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    quantity: d.float('quantity', { unsigned: true }).notNull(),
    createdAt: d.timestamp('created_at').defaultNow(),
    updatedAt: d.timestamp('updated_at').defaultNow().onUpdateNow(),
  }),
  (t) => [primaryKey({ columns: [t.recipeDataId, t.ingredientId] })],
);

export const savedRecipes = table(
  'saved_recipes',
  (d) => ({
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    recipeId: d
      .bigint('recipe_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: d.timestamp('created_at').defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.recipeId] })],
);
