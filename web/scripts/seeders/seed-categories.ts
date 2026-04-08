import 'dotenv/config';

import { db } from '~/server/db';
import { categories } from '~/server/db/schema';

const data = [
  { name: 'Reggeli' },
  { name: 'Tízórai/Snack' },
  { name: 'Leves' },
  { name: 'Előétel' },
  { name: 'Főétel' },
  { name: 'Saláta' },
  { name: 'Köret' },
  { name: 'Desszert' },
  { name: 'Szendvics/Wrap' },
] satisfies (typeof categories.$inferInsert)[];

export async function seedCategories() {
  console.log('⏳ Seeding categories...');
  await db.insert(categories).values(data);
  console.log('✅ Categories seeded.');
}
