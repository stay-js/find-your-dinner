import 'dotenv/config';

import { seedAdmins } from './seeders/seed-admins';
import { seedCategories } from './seeders/seed-categories';
import { seedIngredients } from './seeders/seed-ingredients';
import { seedUnits } from './seeders/seed-units';

async function seedDB() {
  await seedAdmins();
  await seedCategories();
  await seedIngredients();
  await seedUnits();
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
