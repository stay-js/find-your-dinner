import 'dotenv/config';

import { db } from '~/server/db';
import { defaultIngredients, ingredients } from '~/server/db/schema';

type DefaultIngredientData = {
  userId: string;

  ingredientNames: string[];
}[];

const data = [
  {
    userId: 'user_3CPCdO9xP7lG2xuj7xsd466sLdd', // znagy clerk prod environment

    ingredientNames: [
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
    ],
  },
] satisfies DefaultIngredientData;

export async function seedDefaultIngredients() {
  console.log('⏳ Seeding default ingredients...');

  const allIngredients = await db.select().from(ingredients);
  const ingredientByName = Object.fromEntries(allIngredients.map(({ id, name }) => [name, id]));

  await db
    .insert(defaultIngredients)
    .values(
      allIngredients.map(({ id }) => ({
        ingredientId: id,
        userId: 'user_3CkzswbYbPXoT2B5OufMVDWwCOK', // znagy 2 clerk prod environment
      })),
    )
    .onConflictDoNothing();

  for (const item of data) {
    await db
      .insert(defaultIngredients)
      .values(
        item.ingredientNames.map((name) => {
          const ingredientId = ingredientByName[name];
          if (!ingredientId) throw new Error(`Ingredient not found: "${name}"`);

          return {
            userId: item.userId,

            ingredientId,
          };
        }),
      )
      .onConflictDoNothing();
  }

  console.log('✅ Default ingredients seeded.');
}
