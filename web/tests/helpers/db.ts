import { sql } from 'drizzle-orm';

import { db } from '~/server/db';

export async function truncateAll() {
  await db.execute(
    sql.raw(`
    TRUNCATE TABLE
      "admins",
      "default_ingredients",
      "saved_recipes",
      "ingredient_recipe_data",
      "category_recipe",
      "recipe_data",
      "recipes",
      "units",
      "ingredients",
      "categories"
    RESTART IDENTITY CASCADE;
  `),
  );
}
