import 'dotenv/config';

import { db } from '~/server/db';
import {
  categories,
  categoryRecipe,
  ingredientRecipeData,
  ingredients,
  recipeData,
  recipes,
  units,
} from '~/server/db/schema';

type RecipeConfig = {
  categories: string[];
  data: Omit<typeof recipeData.$inferInsert, 'recipeId'>;
  ingredients: { name: string; quantity: number; unit: string }[];
  userId: string;
};

const data = [
  {
    categories: ['Desszert'],
    data: {
      cookTimeMinutes: 20,
      description:
        'Mutatósabb egyfalatos rákóczi túrós ha kicsit mutatósabb sütit készítenétek\n\nKép forrása: Dobos Bea blogspot',
      instructions:
        'A tésztához a lisztet és a porcukrot elmorzsoljuk a vajjal majd egy tojás sárgájával összegyúrjuk. Hűtőben pihentetjük 30 percet.\nKinyújtjuk, köralakúra szaggatjuk, majd 180 C°-os sütőben 8-10 perc alatt készre sütjük.\nA túrókrémet jól kikeverjük (túró, 30 g porcukor, fél citrom leve és héja) majd a kisült linzer közepére kis halmokat teszünk belőle. \nA tojások fehérjét egy csipet sóval és a porcukorralv(210g) elkezdjük felverni majd vízgőz felett addig verjük, amíg fényes, sűrű habot kapunk. \nHabzsákba töltjük és a túró köré koszorúba nyomjuk, 150 C°-on  8-10 percig visszatesszük a sütőbe száradni.\nBaracklekvárt nyomunk a közepébe.',
      prepTimeMinutes: 40,
      previewImageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMSJHlCWFfubwILkjX9OehkuMC-lhazNTA0usf-_LiH1PHlpjNo81hhpwCVq-KUMyoXq1WIKAMAso9fD6R7iFJ8zI3K4nFNv-3osDOOMuHH6MhC5_r-l4w_GxmNtn9iPLySa3kV8FAz8E/s1600/R%25C3%25A1k%25C3%25B3czi+t%25C3%25BAr%25C3%25B3s+kos%25C3%25A1rka+%25284%2529.JPG',
      servings: 2,
      title: 'Extra Rákóczi Túrós',
      verified: true,
    },
    ingredients: [
      { name: 'Búzaliszt', quantity: 300, unit: 'g' },
      { name: 'Vaj', quantity: 200, unit: 'g' },
      { name: 'Porcukor', quantity: 340, unit: 'g' },
      { name: 'Tojás', quantity: 3, unit: 'db' },
      { name: 'Túró', quantity: 250, unit: 'g' },
      { name: 'Citrom', quantity: 1, unit: 'db' },
      { name: 'Só', quantity: 1, unit: 'csipet' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Tízórai/Snack'],
    data: {
      cookTimeMinutes: 20,
      description:
        'Sós aprósütemény bármilyen alkalomra, akár nagy adagban elkészítve, majd fagyasztóban tárolva váratlan vendégek esetén.',
      instructions:
        'A sajtot lereszeljük és kettéosztjuk. \nA sajt egyik részén egy tojáson és a köménymagon kívül mindent összegyúrunk, majd ha egységes tésztát kaptunk legalább 30 percet fagyasztóban pihentetjük. \n3-4mm vastagra nyújtjuk a tésztát majd a maradék egy tojást felverjük és lekenjük vele a tésztát.\nEzután megszórjuk sajttal és köménymaggal, majd ízlés szerinti vastagságú rudakat vágunk belőle.\n\n200C°-os előmelegített sütőben 10-15 perc alatt aranybarnára sütjük.',
      prepTimeMinutes: 30,
      previewImageUrl: 'https://www.facebook.com/24658824-28b9-4ce3-91fa-0732fde567ba',
      servings: 1,
      title: 'Sajtos-köményes ropi',
      verified: true,
    },
    ingredients: [
      { name: 'Vaj', quantity: 200, unit: 'g' },
      { name: 'Búzaliszt', quantity: 250, unit: 'g' },
      { name: 'Tejföl', quantity: 2, unit: 'ek' },
      { name: 'Só', quantity: 10, unit: 'g' },
      { name: 'Sajt', quantity: 200, unit: 'g' },
      { name: 'Köménymag', quantity: 2, unit: 'ek' },
      { name: 'Tojás', quantity: 2, unit: 'db' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Desszert'],
    data: {
      cookTimeMinutes: 5,
      description: 'Családi recept, több generáció dolgozta tökéletesre.',
      instructions:
        'A krumplit puhára főzzük, majd meghámozzuk (ha főzés előtt még nem tettük) majd összetörjük. Hozzáadjuk a lisztet, ha még ragacsosnak érezzük a tésztát tegyünk annyi lisztet bele amennyit felvesz.\nA morzsához megpirítjuk a morzsát a cukorral folyamatos kevergetés mellett, csak a végén adjuk hozzá a fahéjat.\nA nudlihoz kis rudakat vágunk a tésztából, lobogó vízben főzzük amíg a felszínre nem jönnek. Ezután megforgathatjuk a morzsában.\n\nA gombócokhoz köralakúra szaggatjuk a tésztát, tölthetjük szilvával, sárgabarackkal, akár lekvárral. Gombócozás után ezt is lobogó vízben kell főzni amíg a felszínre nem úsznak, utána ezt is forgassuk meg a morzsában és kész is.',
      prepTimeMinutes: 30,
      previewImageUrl: 'https://images.pexels.com/photos/34938281/pexels-photo-34938281.jpeg',
      servings: 2,
      title: 'Alap nudli és gombóctészta',
      verified: true,
    },
    ingredients: [
      { name: 'Búzaliszt', quantity: 500, unit: 'g' },
      { name: 'Burgonya', quantity: 250, unit: 'g' },
      { name: 'Fahéj', quantity: 3, unit: 'ek' },
      { name: 'Panírmorzsa', quantity: 100, unit: 'g' },
      { name: 'Cukor', quantity: 70, unit: 'g' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Desszert'],
    data: {
      cookTimeMinutes: 45,
      description: 'Egyszerű és gyors császármorzsa',
      instructions:
        'A vajat megolvasztjuk, tojást a cukorral kikeverjük majd hozzáadjuk a vajat citromhéjat és a tejet. Ha ezeket összekevertük 2-3 részletben keverjük hozzá a lisztet. Zománcolt tepsiben, előmelegített sütőben sütjük 180 C°-on amíg kérgesedik az alja. Ezután kivesszük, kisebb darabokra törjük a tésztát és készre sütjük.',
      prepTimeMinutes: 15,
      previewImageUrl: 'https://images.pexels.com/photos/19772138/pexels-photo-19772138.jpeg',
      servings: 3,
      title: 'Császármorzsa',
      verified: true,
    },
    ingredients: [
      { name: 'Búzaliszt', quantity: 300, unit: 'g' },
      { name: 'Tojás', quantity: 6, unit: 'db' },
      { name: 'Cukor', quantity: 100, unit: 'g' },
      { name: 'Tej', quantity: 2, unit: 'dl' },
      { name: 'Vaj', quantity: 100, unit: 'g' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Saláta', 'Köret'],
    data: {
      cookTimeMinutes: 0,
      description: 'Könnyed saláta ha elegünk lenne a húsokból.',
      instructions:
        'A zöldségeket ízlés szerinti méretre vágjuk majd egy nagy tálba tesszük.\nRámorzsoljuk a feta sajtot és állni hagyjuk míg előkészítjük a friss fűszereket.\nA petrezselymet és a mentát apróra vágjuk, kifacsarjuk a fél citrom levét.\nHozzáadjuk a salátához a mentát, petrezselymet és a citrom levét, illetve a sót, borsot, olajat. \nAlaposan összekeverjük és tálalhatjuk is.',
      prepTimeMinutes: 15,
      previewImageUrl: 'https://images.pexels.com/photos/14016727/pexels-photo-14016727.jpeg',
      servings: 2,
      title: 'Görög saláta',
      verified: true,
    },
    ingredients: [
      { name: 'Paradicsom', quantity: 3, unit: 'db' },
      { name: 'Uborka', quantity: 1, unit: 'db' },
      { name: 'Citrom', quantity: 1, unit: 'db' },
      { name: 'Feta sajt', quantity: 100, unit: 'g' },
      { name: 'Olívaolaj', quantity: 2, unit: 'ek' },
      { name: 'Olajbogyó', quantity: 100, unit: 'g' },
      { name: 'Só', quantity: 1, unit: 'ek' },
      { name: 'Fekete bors', quantity: 1, unit: 'tk' },
      { name: 'Petrezselyem', quantity: 1, unit: 'csomag' },
      { name: 'Menta', quantity: 1, unit: 'csomag' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Reggeli', 'Tízórai/Snack'],
    data: {
      cookTimeMinutes: 10,
      description: 'Török lecsó reggelire',
      instructions:
        'Első lépésként a paradicsomokat felkockázzuk majd serpenyőben, alacsony lángon pirítani kezdjük. \nKözben felaprítjuk a hagymát és a többi zöldséget is. A fokhagymát össze is zúzhatjuk, viszont így megbontjuk azokat a rostokat amelyeket ha késsel vágnánk fel, nem bántanánk. (Zúzás hatására kellemetlenebb lehet a leheltünk.)\nHa már engedett egy kevés levet a paradicsom hozzáadjuk a vöröshagymát, majd üvegesre pároljuk. Ezután mehet bele a fokhagyma, végül a paprika.\nHa az összes zöldség összeesett, fűszerezzük, és keverjük hozzá a paradicsompürét is. Hagyjuk rotyogni (továbbra is alacsony lángon) néhány percig vagy amíg szimpatikus állagú nem lesz. \nHa elértük a kívánt állagot, fakanállal csináljunk helyet a tojásoknak majd üssük bele őket és fedjük le egy fedővel. Folyósabb tojásért amint látjuk hogy a tojás a tetején már fehér, zárjuk el a gázt, pirítsunk hozzá kenyeret, szórjuk meg petrezselyemmel és kaporral, esetleg egy kevés chili olajjal. Máris fogyaszthatjuk, egészségünkre!',
      prepTimeMinutes: 10,
      previewImageUrl: 'https://images.pexels.com/photos/9027325/pexels-photo-9027325.jpeg',
      servings: 2,
      title: 'Shakshuka',
      verified: true,
    },
    ingredients: [
      { name: 'Paradicsom', quantity: 2, unit: 'db' },
      { name: 'Paprika', quantity: 2, unit: 'dl' },
      { name: 'Paradicsompüré', quantity: 2, unit: 'ek' },
      { name: 'Tojás', quantity: 4, unit: 'db' },
      { name: 'Só', quantity: 1, unit: 'tk' },
      { name: 'Fekete bors', quantity: 1, unit: 'tk' },
      { name: 'Vöröshagyma', quantity: 1, unit: 'db' },
      { name: 'Fokhagyma', quantity: 2, unit: 'gerezd' },
      { name: 'Petrezselyem', quantity: 1, unit: 'csomag' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
  {
    categories: ['Reggeli', 'Tízórai/Snack', 'Előétel', 'Főétel'],
    data: {
      cookTimeMinutes: 45,
      description: 'Autentikus görög recept a mindennapokra',
      instructions:
        'Először kevés olajon megpirítjuk az összezúzott fokhagymákat majd ráöntjük a spenótot sózzuk, borsozzuk és hagyjuk hogy megfonnyadjon majd a karikázott póréhagymát is hozzátesszük. \nKözben előkészítünk egy piteformát amibe egyenként beletesszük a réteslapok felét, laponként olajjal vagy vízzel (attól függően hogy diétázunk-e éppen :D) megkenjük.\nHa a lapok fele elfogyott, beletesszük a fokhagymás spenótos-hagymás keveréket, felverjük a tojásokat és azt is ráöntjük. \nVégül ahogy korábban is rátesszük a maradék réteslapot, laponként megkenjük, a tetejét is, majd 180 C°-os sütőben kb. 45 perc alatt készre sütjük',
      prepTimeMinutes: 20,
      previewImageUrl: 'https://images.pexels.com/photos/30674035/pexels-photo-30674035.jpeg',
      servings: 3,
      title: 'Görög spenótos pite',
      verified: true,
    },
    ingredients: [
      { name: 'Spenót', quantity: 1, unit: 'csomag' },
      { name: 'Feta sajt', quantity: 200, unit: 'g' },
      { name: 'Póréhagyma', quantity: 1, unit: 'db' },
      { name: 'Tojás', quantity: 3, unit: 'db' },
      { name: 'Só', quantity: 1, unit: 'tk' },
      { name: 'Fekete bors', quantity: 1, unit: 'tk' },
      { name: 'Fokhagyma', quantity: 4, unit: 'gerezd' },
      { name: 'Olívaolaj', quantity: 5, unit: 'cl' },
    ],
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH',
  },
] satisfies RecipeConfig[];

export async function seedRecipes() {
  console.log('⏳ Seeding recipes...');

  const allIngredients = await db
    .select({ id: ingredients.id, name: ingredients.name })
    .from(ingredients);
  const ingredientByName = Object.fromEntries(allIngredients.map(({ id, name }) => [name, id]));

  const allUnits = await db.select({ abbreviation: units.abbreviation, id: units.id }).from(units);
  const unitByAbbr = Object.fromEntries(allUnits.map(({ abbreviation, id }) => [abbreviation, id]));

  const allCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories);
  const categoryByName = Object.fromEntries(allCategories.map(({ id, name }) => [name, id]));

  for (const item of data) {
    await db.transaction(async (tx) => {
      const [recipeInsertResult] = await tx
        .insert(recipes)
        .values({ userId: item.userId })
        .returning({ id: recipes.id });

      const recipeId = recipeInsertResult?.id;
      if (!recipeId) throw new Error('Failed to insert recipe');

      const [recipeDataInsertResult] = await tx
        .insert(recipeData)
        .values({ recipeId, ...item.data })
        .returning({ id: recipeData.id });

      const recipeDataId = recipeDataInsertResult?.id;
      if (!recipeDataId) throw new Error('Failed to insert recipe data');

      if (item.ingredients.length > 0) {
        await tx.insert(ingredientRecipeData).values(
          item.ingredients.map((i) => {
            const ingredientId = ingredientByName[i.name];
            if (!ingredientId) throw new Error(`Ingredient not found: "${i.name}"`);

            const unitId = unitByAbbr[i.unit];
            if (!unitId) throw new Error(`Unit not found: "${i.unit}"`);

            return { ingredientId, quantity: i.quantity, recipeDataId, unitId };
          }),
        );
      }

      if (item.categories.length > 0) {
        await tx.insert(categoryRecipe).values(
          item.categories.map((cat) => {
            const categoryId = categoryByName[cat];
            if (!categoryId) throw new Error(`Category not found: "${cat}"`);

            return { categoryId, recipeId };
          }),
        );
      }
    });
  }

  console.log('✅ Recipes seeded.');
}
