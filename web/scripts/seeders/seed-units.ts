import 'dotenv/config';

import { db } from '~/server/db';
import { units } from '~/server/db/schema';

const data = [
  { abbreviation: 'g', name: 'Gramm' },
  { abbreviation: 'dkg', name: 'Dekagramm' },
  { abbreviation: 'kg', name: 'Kilogramm' },

  { abbreviation: 'ml', name: 'Milliliter' },
  { abbreviation: 'cl', name: 'Centiliter' },
  { abbreviation: 'dl', name: 'Deciliter' },
  { abbreviation: 'l', name: 'Liter' },

  { abbreviation: 'db', name: 'Darab' },

  { abbreviation: 'tk', name: 'Teáskanál' },
  { abbreviation: 'ek', name: 'Evőkanál' },

  { abbreviation: 'csipet', name: 'Csipet' },

  { abbreviation: 'pohár', name: 'Pohár' },
  { abbreviation: 'bögre', name: 'Bögre' },

  { abbreviation: 'csomag', name: 'Csomag' },

  { abbreviation: 'gerezd', name: 'Gerezd' },

  { abbreviation: 'szelet', name: 'Szelet' },
] satisfies (typeof units.$inferInsert)[];

export async function seedUnits() {
  console.log('⏳ Seeding units...');
  await db.insert(units).values(data).onConflictDoNothing();
  console.log('✅ Units seeded.');
}
