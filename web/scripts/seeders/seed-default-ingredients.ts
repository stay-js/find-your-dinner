import 'dotenv/config';

import { db } from '~/server/db';
import { defaultIngredients, ingredients } from '~/server/db/schema';

const userIdsToSeedWithSelectedIngedients = [
  'user_38bzMM6AVsxkk7dJNc7n4GLSkDm', // znagy clerk dev environment
  'user_3CPCdO9xP7lG2xuj7xsd466sLdd', // znagy clerk prod environment
];

const userIdsToSeedWithAllIngredients = [
  'user_3Clo0wtsXPon7mNlAazTciKb0Lv', // znagy 2 clerk dev environment
  'user_3CkzswbYbPXoT2B5OufMVDWwCOK', // znagy 2 clerk prod environment
];

const defaultIngredientNames = [
  'Babérlevél',
  'Balzsamecet',
  'Bazsalikom',
  'Búzaliszt',
  'Cukor',
  'Ecet',
  'Fahéj',
  'Fekete bors',
  'Kakaópor',
  'Kakukkfű',
  'Ketchup',
  'Kínai ötfűszer',
  'Kömény',
  'Majonéz',
  'Mustár',
  'Napraforgóolaj',
  'Olívaolaj',
  'Őrölt koriander',
  'Őrölt paprika',
  'Porcukor',
  'Rozmaring',
  'Só',
  'Sütőpor',
  'Szegfűszeg',
  'Szódabikarbóna',
  'Víz',
];

export async function seedDefaultIngredients() {
  console.log('⏳ Seeding default ingredients...');

  const allIngredients = await db.select().from(ingredients);
  const ingredientByName = Object.fromEntries(allIngredients.map(({ id, name }) => [name, id]));

  for (const userId of userIdsToSeedWithAllIngredients) {
    await db
      .insert(defaultIngredients)
      .values(allIngredients.map(({ id }) => ({ ingredientId: id, userId })))
      .onConflictDoNothing();
  }

  for (const userId of userIdsToSeedWithSelectedIngedients) {
    await db
      .insert(defaultIngredients)
      .values(
        defaultIngredientNames.map((name) => {
          const ingredientId = ingredientByName[name];
          if (!ingredientId) throw new Error(`Ingredient not found: "${name}"`);

          return { ingredientId, userId };
        }),
      )
      .onConflictDoNothing();
  }

  console.log('✅ Default ingredients seeded.');
}
