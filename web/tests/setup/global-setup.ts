import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

import { env } from '~/env';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function globalSetup() {
  const pool = new Pool({ connectionString: env.TEST_DATABASE_URL });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '../../drizzle') });
  } finally {
    await pool.end();
  }
}
