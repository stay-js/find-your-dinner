import 'dotenv/config';

import { sql } from 'drizzle-orm';

import { db } from '~/server/db';
import { env } from '~/env.js';

async function resetDB() {
  const dbName = env.DATABASE_URL.split('/').at(-1);

  if (!dbName) {
    throw new Error('Could not determine database name from DATABASE_URL');
  }

  console.log(`⏳ Dropping database "${dbName}"...`);
  await db.execute(sql.raw(`DROP DATABASE IF EXISTS \`${dbName}\``));
  console.log('✅ Database dropped successfully.');

  console.log(`⏳ Creating database "${dbName}"...`);
  await db.execute(sql.raw(`CREATE DATABASE \`${dbName}\``));
  console.log('✅ Database created successfully.');
}

resetDB()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ An unexpected error occurred:', error);
    process.exit(1);
  });
