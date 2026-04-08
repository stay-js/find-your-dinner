import 'dotenv/config';

import { db } from '~/server/db';
import { admins } from '~/server/db/schema';

const data = [
  { userId: 'user_38bzMM6AVsxkk7dJNc7n4GLSkDm' }, // znagy, dev
] satisfies (typeof admins.$inferInsert)[];

export async function seedAdmins() {
  console.log('⏳ Seeding admins...');
  await db.insert(admins).values(data);
  console.log('✅ Admins seeded.');
}
