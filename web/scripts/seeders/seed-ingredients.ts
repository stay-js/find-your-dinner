import 'dotenv/config';

import { db } from '~/server/db';
import { ingredients } from '~/server/db/schema';

const data = [
  { name: 'Só' },
  { name: 'Cukor' },
  { name: 'Búzaliszt' },
  { name: 'Tojás' },
  { name: 'Víz' },
  { name: 'Tej' },
  { name: 'Vaj' },
  { name: 'Olaj' },
  { name: 'Hagyma' },
  { name: 'Fokhagyma' },
] satisfies (typeof ingredients.$inferInsert)[];

export async function seedIngredients() {
  console.log('⏳ Seeding ingredients...');
  await db.insert(ingredients).values(data);
  console.log('✅ Ingredients seeded.');
}
