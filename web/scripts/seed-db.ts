import 'dotenv/config';

import { seedAdmins } from './seeders/seed-admins';
import { seedCategories } from './seeders/seed-categories';
import { seedDefaultIngredients } from './seeders/seed-default-ingredients';
import { seedIngredients } from './seeders/seed-ingredients';
import { seedRecipes } from './seeders/seed-recipes';
import { seedUnits } from './seeders/seed-units';

async function seedDB() {
  await seedAdmins();
  await seedCategories();
  await seedIngredients();
  await seedUnits();
  await seedRecipes();

  await seedDefaultIngredients();
}

seedDB()
  .then(() => {
    console.log('✅ Database seeded successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ An unexpected error occurred:', error);
    process.exit(1);
  });
