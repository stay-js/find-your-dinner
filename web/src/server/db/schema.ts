import { sql } from 'drizzle-orm';
import { index, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).notNull().unique(),
}));

export const recipes = pgTable('recipes', (d) => ({
  id: d.bigint('id', { mode: 'number' }).notNull().primaryKey().generatedAlwaysAsIdentity(),
  userId: d.varchar('user_id', { length: 256 }).notNull(),

  createdAt: d.timestamp('created_at').notNull().defaultNow(),
}));

export const recipeData = pgTable(
  'recipe_data',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).notNull().primaryKey().generatedAlwaysAsIdentity(),
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

    createdAt: d.timestamp('created_at').notNull().defaultNow(),
    updatedAt: d
      .timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('recipe_data_fts_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('hungarian', ${t.title}), 'A') ||
        setweight(to_tsvector('hungarian', ${t.description}), 'B')
        )`,
    ),
    index('recipe_data_title_trgm_idx').using('gin', sql`${t.title} gin_trgm_ops`),
    index('recipe_data_description_trgm_idx').using('gin', sql`${t.description} gin_trgm_ops`),
  ],
);

export const units = pgTable(
  'units',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).notNull().primaryKey().generatedAlwaysAsIdentity(),

    abbreviation: d.varchar('abbreviation', { length: 16 }).notNull(),
    name: d.varchar('name', { length: 64 }).notNull().unique(),
  }),
  (t) => [
    index('units_fts_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('hungarian', ${t.name}), 'A') ||
        setweight(to_tsvector('hungarian', ${t.abbreviation}), 'B')
        )`,
    ),
    index('units_name_trgm_idx').using('gin', sql`${t.name} gin_trgm_ops`),
    index('units_abbreviation_trgm_idx').using('gin', sql`${t.abbreviation} gin_trgm_ops`),
  ],
);

export const ingredients = pgTable(
  'ingredients',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).notNull().primaryKey().generatedAlwaysAsIdentity(),

    name: d.varchar('name', { length: 256 }).notNull().unique(),
  }),
  (t) => [
    index('ingredients_fts_idx').using('gin', sql`to_tsvector('hungarian', ${t.name})`),
    index('ingredients_name_trgm_idx').using('gin', sql`${t.name} gin_trgm_ops`),
  ],
);

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

export const categories = pgTable(
  'categories',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).notNull().primaryKey().generatedAlwaysAsIdentity(),

    name: d.varchar('name', { length: 128 }).notNull().unique(),
  }),
  (t) => [
    index('categories_fts_idx').using('gin', sql`to_tsvector('hungarian', ${t.name})`),
    index('categories_name_trgm_idx').using('gin', sql`${t.name} gin_trgm_ops`),
  ],
);

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

    createdAt: d.timestamp('created_at').notNull().defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.recipeId] })],
);

export const defaultIngredients = pgTable(
  'default_ingredients',
  (d) => ({
    userId: d.varchar('user_id', { length: 256 }).notNull(),

    ingredientId: d
      .bigint('ingredient_id', { mode: 'number' })
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.ingredientId] })],
);
