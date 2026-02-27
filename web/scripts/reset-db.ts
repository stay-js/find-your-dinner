import 'dotenv/config';
import { sql } from 'drizzle-orm';

import { db } from '~/server/db';

async function resetDB() {
  console.log('⏳ Dropping public schema...');
  await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "public" CASCADE;`));
  console.log('✅ Schema dropped.');

  console.log('⏳ Recreating public schema...');
  await db.execute(sql.raw(`CREATE SCHEMA "public";`));
  console.log('✅ Schema recreated.');

  console.log('⏳ Dropping drizzle schema...');
  await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));
  console.log('✅ Schema dropped.');
}

resetDB()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ An unexpected error occurred:', error);
    process.exit(1);
  });
