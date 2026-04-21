import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '~/env';
import * as schema from '~/server/db/schema';

const pool = new Pool({ connectionString: env.TEST_DATABASE_URL });

export const testDb = drizzle(pool, { schema });

export async function truncateAll() {
  await testDb.execute(
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
