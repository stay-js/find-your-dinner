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

type Recipe = {
  userId: string;

  data: Omit<typeof recipeData.$inferInsert, 'recipeId'>;

  categories: string[];
  ingredients: { name: string; quantity: number; unit: string }[];
};

const data = [
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Sajtos-köményes ropi',

      description:
        'Sós aprósütemény bármilyen alkalomra, akár nagy adagban elkészítve, majd fagyasztóban tárolva váratlan vendégek esetén.',
      instructions:
        'A sajtot lereszeljük és kettéosztjuk.\nA sajt egyik részén egy tojáson és a köménymagon kívül mindent összegyúrunk, majd ha egységes tésztát kaptunk legalább 30 percet fagyasztóban pihentetjük.\n3-4mm vastagra nyújtjuk a tésztát, majd a maradék egy tojást felverjük és lekenjük vele a tésztát.\nEzután megszórjuk sajttal és köménymaggal, majd ízlés szerinti vastagságú rudakat vágunk belőle.\n\n200C°-os előmelegített sütőben 10-15 perc alatt aranybarnára sütjük.',

      previewImageUrl: 'https://uploads.znagy.hu/sajtos_komenyes_ropi.jpg',

      cookTimeMinutes: 20,
      prepTimeMinutes: 30,

      servings: 1,

      verified: true,
    },

    categories: ['Tízórai/Snack'],

    ingredients: [
      { name: 'Vaj', quantity: 200, unit: 'g' },
      { name: 'Búzaliszt', quantity: 250, unit: 'g' },
      { name: 'Tejföl', quantity: 2, unit: 'ek' },
      { name: 'Só', quantity: 10, unit: 'g' },
      { name: 'Sajt', quantity: 200, unit: 'g' },
      { name: 'Köménymag', quantity: 2, unit: 'ek' },
      { name: 'Tojás', quantity: 2, unit: 'db' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Alap nudli és gombóctészta',

      description: 'Családi recept, több generáció dolgozta tökéletesre.',
      instructions:
        'A krumplit puhára főzzük, majd meghámozzuk (ha főzés előtt még nem tettük) ezután összetörjük. Hozzáadjuk a lisztet, ha még ragacsosnak érezzük a tésztát tegyünk annyi lisztet bele amennyit felvesz.\nA morzsához megpirítjuk a morzsát a cukorral folyamatos kevergetés mellett, csak a végén adjuk hozzá a fahéjat.\nA nudlihoz kis rudakat vágunk a tésztából, lobogó vízben főzzük amíg a felszínre nem jönnek. Ezután megforgathatjuk a morzsában.\n\nA gombócokhoz köralakúra szaggatjuk a tésztát, tölthetjük szilvával, sárgabarackkal, akár lekvárral. Gombócozás után ezt is lobogó vízben kell főzni amíg a felszínre nem úsznak, utána ezt is forgassuk meg a morzsában és kész is.',

      previewImageUrl: 'https://images.pexels.com/photos/34938281/pexels-photo-34938281.jpeg',

      cookTimeMinutes: 5,
      prepTimeMinutes: 30,

      servings: 2,

      verified: true,
    },

    categories: ['Desszert'],

    ingredients: [
      { name: 'Búzaliszt', quantity: 500, unit: 'g' },
      { name: 'Burgonya', quantity: 250, unit: 'g' },
      { name: 'Fahéj', quantity: 3, unit: 'ek' },
      { name: 'Panírmorzsa', quantity: 100, unit: 'g' },
      { name: 'Cukor', quantity: 70, unit: 'g' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Császármorzsa',

      description: 'Egyszerű és gyors császármorzsa.',
      instructions:
        'A vajat megolvasztjuk, tojást a cukorral kikeverjük, majd hozzáadjuk a vajat citromhéjat és a tejet. Ha ezeket összekevertük 2-3 részletben keverjük hozzá a lisztet. Zománcolt tepsiben, előmelegített sütőben sütjük 180 C°-on amíg kérgesedik az alja. Ezután kivesszük, kisebb darabokra törjük a tésztát és készre sütjük.',

      previewImageUrl: 'https://images.pexels.com/photos/19772138/pexels-photo-19772138.jpeg',

      cookTimeMinutes: 45,
      prepTimeMinutes: 15,

      servings: 3,

      verified: true,
    },

    categories: ['Desszert'],

    ingredients: [
      { name: 'Búzaliszt', quantity: 300, unit: 'g' },
      { name: 'Tojás', quantity: 6, unit: 'db' },
      { name: 'Cukor', quantity: 100, unit: 'g' },
      { name: 'Tej', quantity: 2, unit: 'dl' },
      { name: 'Vaj', quantity: 100, unit: 'g' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Görög saláta',

      description: 'Könnyed saláta, ha elegünk lenne a húsokból.',
      instructions:
        'A zöldségeket ízlés szerinti méretre vágjuk, majd egy nagy tálba tesszük.\nRámorzsoljuk a feta sajtot és állni hagyjuk míg előkészítjük a friss fűszereket.\nA petrezselymet és a mentát apróra vágjuk, kifacsarjuk a fél citrom levét.\nHozzáadjuk a salátához a mentát, petrezselymet és a citrom levét, illetve a sót, borsot, olajat.\nAlaposan összekeverjük és tálalhatjuk is.',

      previewImageUrl: 'https://images.pexels.com/photos/14016727/pexels-photo-14016727.jpeg',

      cookTimeMinutes: 0,
      prepTimeMinutes: 15,

      servings: 2,

      verified: true,
    },

    categories: ['Saláta', 'Köret'],

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
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Shakshuka',

      description: 'Török lecsó reggelire.',
      instructions:
        'Első lépésként a paradicsomokat felkockázzuk, majd serpenyőben, alacsony lángon pirítani kezdjük.\nKözben felaprítjuk a hagymát és a többi zöldséget is. A fokhagymát össze is zúzhatjuk, viszont így megbontjuk azokat a rostokat amelyeket, ha késsel vágnánk fel, nem bántanánk. (Zúzás hatására kellemetlenebb lehet a leheltünk.)\nHa már engedett egy kevés levet a paradicsom hozzáadjuk a vöröshagymát, majd üvegesre pároljuk. Ezután mehet bele a fokhagyma, végül a paprika.\nHa az összes zöldség összeesett, fűszerezzük, és keverjük hozzá a paradicsompürét is. Hagyjuk rotyogni (továbbra is alacsony lángon) néhány percig vagy amíg szimpatikus állagú nem lesz.\nHa elértük a kívánt állagot, fakanállal csináljunk helyet a tojásoknak majd üssük bele őket és fedjük le egy fedővel. Folyósabb tojásért amint látjuk hogy a tojás a tetején már fehér, zárjuk el a gázt, pirítsunk hozzá kenyeret, szórjuk meg petrezselyemmel és kaporral, esetleg egy kevés chili olajjal. Máris fogyaszthatjuk, egészségünkre!',

      previewImageUrl: 'https://images.pexels.com/photos/9027325/pexels-photo-9027325.jpeg',

      cookTimeMinutes: 10,
      prepTimeMinutes: 10,

      servings: 2,

      verified: true,
    },

    categories: ['Reggeli', 'Tízórai/Snack'],

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
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Görög spenótos pite',

      description: 'Autentikus görög recept a mindennapokra.',
      instructions:
        'Először kevés olajon megpirítjuk az összezúzott fokhagymákat, majd ráöntjük a spenótot sózzuk, borsozzuk és hagyjuk, hogy megfonnyadjon, majd a karikázott póréhagymát is hozzátesszük.\nKözben előkészítünk egy piteformát amibe egyenként beletesszük a réteslapok felét, laponként olajjal vagy vízzel (attól függően hogy diétázunk-e éppen :D) megkenjük.\nHa a lapok fele elfogyott, beletesszük a fokhagymás spenótos-hagymás keveréket, felverjük a tojásokat és azt is ráöntjük.\nVégül ahogy korábban is rátesszük a maradék réteslapot, laponként megkenjük, a tetejét is, majd 180 C°-os sütőben kb. 45 perc alatt készre sütjük',

      previewImageUrl: 'https://images.pexels.com/photos/30674035/pexels-photo-30674035.jpeg',

      cookTimeMinutes: 45,
      prepTimeMinutes: 20,

      servings: 3,

      verified: true,
    },

    categories: ['Reggeli', 'Tízórai/Snack', 'Előétel', 'Főétel'],

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
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Nokedli',

      description: 'Egy jól bevált nokedli alaprecept, elengedhetetlen egy magyar ember életében!',
      instructions:
        'Egy nagy fazékba felteszünk nagyon sós vizet forrni!\n\nA nokedlihez mindent egy tálba teszünk és összekeverjük.\nÉrdemes fakanállal keverni, vagy legalábbis nem kézi géppel, mert így könnyen túl tudjuk keverni a tésztát.\nA tésztát pihentetni sem érdemes, ezért jobb már mielőtt belekezdünk a tésztába feltenni forrni a vizet.\nAmint forr a víz, keverünk rajta egyet, hogy majd ne tapadjon le a fazék aljára a tészta, és máris szaggathatjuk bele a nokedlit. Néhány perc alatt feljön a víz tetejére, ekkor főtt meg.\n\nNagymamámnál ilyenkor a nokedliből az első étel sajtos nokedli volt, amihez szalonnát is sütött, ennek kisült zsírjába forgatta bele a nokedlit hogy ne ragadjon össze, majd sajttal, tejföllel, korábban sült szalonnával tálalta. Persze ha éppen nem szeretnénk ezzel bajlódni vajjal, vagy bármilyen zsiradékkal működik ez a trükk, az összeragadás ellen.',

      previewImageUrl: 'https://images.pexels.com/photos/116721/pexels-photo-116721.jpeg',

      cookTimeMinutes: 5,
      prepTimeMinutes: 15,

      servings: 4,

      verified: true,
    },

    categories: ['Köret'],

    ingredients: [
      { name: 'Búzaliszt', quantity: 500, unit: 'g' },
      { name: 'Só', quantity: 1, unit: 'ek' },
      { name: 'Napraforgóolaj', quantity: 1, unit: 'ek' },
      { name: 'Tojás', quantity: 1, unit: 'db' },
      { name: 'Víz', quantity: 1, unit: 'dl' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Tonhalkrém (Panna-féle)',

      description: 'Tonhalkrém tésztához, salátához akár pirítósra.',
      instructions:
        'A hagymát apró kockákra vágjuk.\nEgy tálba beletesszük a tejfölt, majonézt, fél citrom levét és a tonhalkonzervet (előtte öntsük le a levét, hogy ne áztassa el a krémet).\nHozzáadjuk a hagymát és felaprítjuk a petrezselymet is, végül ezt is a krémhez keverjük.\nSózzuk, borsozzuk és kész is. Ha áll egy kicsit jobban összeérnek az ízek, de azonnal is fogyaszthatjuk.\n\nPetrezselyem helyett használhatunk koriandert is különlegesebb ízélményért. Lilahagyma helyett használhatunk újhagymát vagy salottahagymát is.',

      previewImageUrl: 'https://images.pexels.com/photos/30910213/pexels-photo-30910213.jpeg',

      cookTimeMinutes: 0,
      prepTimeMinutes: 15,

      servings: 1,

      verified: true,
    },

    categories: ['Előétel', 'Főétel', 'Saláta', 'Szendvics/Wrap'],

    ingredients: [
      { name: 'Tonhal', quantity: 1, unit: 'konzerv' },
      { name: 'Petrezselyem', quantity: 1, unit: 'csokor' },
      { name: 'Tejföl', quantity: 4, unit: 'ek' },
      { name: 'Majonéz', quantity: 1, unit: 'ek' },
      { name: 'Lilahagyma', quantity: 0.5, unit: 'dl' },
      { name: 'Só', quantity: 1, unit: 'tk' },
      { name: 'Fekete bors', quantity: 0.5, unit: 'tk' },
      { name: 'Citrom', quantity: 0.5, unit: 'dl' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Tonhalkrém (Zétény-féle)',

      description: 'Tonhalkrém mascarponéval és paradicsomszósszal, a mediteránabb ízekért.',
      instructions:
        'Először apró kockákra vágjuk a hagymát, majd egy tálba tesszük.\nTálba mérjük a paradicsomszószt, és hozzátesszük a többi hozzávalót is.\nAlaposan összekeverjük és ehetjük is.',

      previewImageUrl: 'https://images.pexels.com/photos/5640048/pexels-photo-5640048.jpeg',

      cookTimeMinutes: 0,
      prepTimeMinutes: 15,

      servings: 1,

      verified: true,
    },

    categories: ['Szendvics/Wrap', 'Tízórai/Snack', 'Saláta', 'Előétel'],

    ingredients: [
      { name: 'Krémsajt', quantity: 250, unit: 'g' },
      { name: 'Paradicsomszósz', quantity: 1, unit: 'dkg' },
      { name: 'Tonhal', quantity: 1, unit: 'konzerv' },
      { name: 'Só', quantity: 1, unit: 'tk' },
      { name: 'Fekete bors', quantity: 0.5, unit: 'tk' },
      { name: 'Oregánó', quantity: 1, unit: 'tk' },
      { name: 'Lilahagyma', quantity: 0.5, unit: 'db' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Bolognai ragu',

      description: 'A legjobb bolognai recept!',
      instructions:
        'A hagymát apróra vágjuk, vagy aprítóban összeaprítjuk.\nNagy edényben hevített olajra dobjuk a hagymát, hagyjuk amíg üveges nem lesz.\nA szárzellert és a répát is a kívánt módon aprítjuk és a hagymához adjuk a fokhagymával együtt. Folyamatosan kevergessük a zöldségeket (mirepoix), hogy ne piruljanak túl.\nNéhány perc után hozzáadjuk a paradicsompürét hagyjuk kicsit pirulni, keverjük át majd a darált húsokat. Ahogy a lábasba tesszük, ne kevergessük sűrűn, hagyjuk, hogy piruljon a hús.\n\nHa színt kapott a hús, hozzáadjuk a fűszereket (kivéve a babérlevelet és a bazsalikomot, ha friss bazsalikomot használunk) és a vörösbort. Mindenképpen száraz bort használjunk, és testesebb bort, hiszen ezekből kapjuk meg a megfelelő aromákat. A szép savszerkezeteket hagyjuk meg a nyári estékre, most válasszuk inkább a tanninokat. Cabernet Sauvignon, Shiraz. Utóbbiból inkább déli borvidékről válasszunk. Amennyiben 5 évnél idősebb a bor, érdemes kitölteni és állni hagyni mielőtt felhasználjuk egy széles szájú üvegben hogy kapjon elég oxigént.\n\nAlacsony lángon hagyjuk rotyogni a ragút, majd ha elforrt az alkohol, adjuk hozzá az alaplevet. Majd a babérlevelet a száránál gyújtsuk meg néhány pillanatra, így sokkal kellemesebb és erősebb lesz az íze. A friss bazsalikomot csak az utolsó néhány percben adjuk hozzá a raguhoz, ne vágjuk apróra, csak tépkedjük el kissé, majd csapjuk össze kezünkkel, így több ízt fog adni a ragunak.\n\nFedjük le a ragut, és hagyjuk rotyogni amíg időnk engedi.\n\nMikor főzzük a tésztát az ételhez, egy merőkanállal adjuk a raguhoz a főzővízből, hogy a tésztából kifőtt keményítőtől besűrűsödjön a ragu, így jobban odatapadjon a tésztához.\n\nExtra tipp: Ha van otthon valamilyen kérges keménysajtunk (Parmezán, pecorino, grana padano) a kérgét amit egyébként kidobnánk, tegyük bele a raguba főni, ezzel egyrészt kevesebb ételt pazarolunk, másrészt kitűnő ízt ad a ragunak.',

      previewImageUrl: 'https://images.pexels.com/photos/6287523/pexels-photo-6287523.jpeg',

      cookTimeMinutes: 40,
      prepTimeMinutes: 30,

      servings: 3,

      verified: true,
    },

    categories: ['Főétel'],

    ingredients: [
      { name: 'Paradicsompüré', quantity: 100, unit: 'g' },
      { name: 'Darált marhahús', quantity: 250, unit: 'g' },
      { name: 'Darált sertéshús', quantity: 250, unit: 'g' },
      { name: 'Szárzeller', quantity: 2, unit: 'db' },
      { name: 'Sárgarépa', quantity: 2, unit: 'db' },
      { name: 'Zöldségalaplé', quantity: 4, unit: 'dl' },
      { name: 'Vörösbor', quantity: 1, unit: 'dkg' },
      { name: 'Babérlevél', quantity: 2, unit: 'db' },
      { name: 'Vöröshagyma', quantity: 1, unit: 'db' },
      { name: 'Oregánó', quantity: 2, unit: 'tk' },
      { name: 'Rozmaring', quantity: 1, unit: 'tk' },
      { name: 'Bazsalikom', quantity: 1, unit: 'tk' },
      { name: 'Kakukkfű', quantity: 1, unit: 'tk' },
      { name: 'Fokhagyma', quantity: 3, unit: 'gerezd' },
      { name: 'Olívaolaj', quantity: 1, unit: 'ek' },
      { name: 'Só', quantity: 1, unit: 'tk' },
      { name: 'Fekete bors', quantity: 0.5, unit: 'tk' },
    ],
  },
  {
    userId: 'user_3CPCdO9xP7lG2xuj7xsd466sLdd', // clerk prod environment, znagy

    data: {
      title: 'Paradicsomsaláta',

      description: 'Egyszerű és gyors paradicsomsaláta, nem lehet nem szeretni.',
      instructions:
        'Szeleteljük fel vékony szeletekre a paradicsomot és a mozzarellát, majd egy szép tányéron felváltva rétegezzük a szeleteket.\nLocsoljuk meg olívaolajjal és balzsamecettel, fűszerezzük majd a végén szórjuk rá a kapribogyókat.',

      previewImageUrl: 'https://images.pexels.com/photos/9873742/pexels-photo-9873742.jpeg',

      cookTimeMinutes: 0,
      prepTimeMinutes: 15,

      servings: 1,

      verified: true,
    },

    categories: ['Előétel', 'Köret', 'Saláta'],

    ingredients: [
      { name: 'Paradicsom', quantity: 3, unit: 'db' },
      { name: 'Mozzarella', quantity: 1, unit: 'db' },
      { name: 'Balzsamecet', quantity: 1, unit: 'ek' },
      { name: 'Kapribogyó', quantity: 1, unit: 'ek' },
      { name: 'Só', quantity: 1, unit: 'csipet' },
      { name: 'Fekete bors', quantity: 0.5, unit: 'csipet' },
      { name: 'Oregánó', quantity: 1, unit: 'tk' },
      { name: 'Bazsalikom', quantity: 0.5, unit: 'csokor' },
    ],
  },
  {
    userId: 'user_3CPCdO9xP7lG2xuj7xsd466sLdd', // clerk prod environment, znagy

    data: {
      title: 'Tonhalas-olivás tészta',

      description: 'Egyszerű tésztaétel rohanós napokra.',
      instructions:
        'Tegyünk fel egy lábasban vizet forrni a tésztának. Ha felforrt, tegyük bele a tésztát.\n\nEgy magas falú serpenyőbe öntsünk egy kevés olajat, majd tegyük rá a felkockázott lilahagymát, és kezdjük el pirítani.\nAmikor a hagyma már kapott egy kis színt, adjuk hozzá a fokhagymát, amit vékony szeletekre vágunk, vagy fokhagymanyomóval összezúzunk.\n\nA paradicsomokat kockázzuk fel, a zöld részeket távolítsuk el. Ha a fokhagyma megpirult, adjuk a serpenyőhöz a paradicsomot is (a vágás során keletkezett paradicsomlevet is öntsük hozzá).\nKarikázzuk fel az olívabogyókat, és tegyük a serpenyőbe, majd fűszerezzük.\n\nHa a paradicsom megpuhult, adjuk hozzá a megfőtt tésztát és néhány kanállal a főzővízből. Végül keverjük bele a tonhalkonzerveket.\n\nAlaposan forgassuk össze a szószt a tésztával, hogy mindenhol bevonja.\n\nHa elkészült, vegyük le a tűzről, szórjuk meg frissen vágott petrezselyemmel, locsoljuk meg egy kevés citromlével, és már tálalhatjuk is.',

      previewImageUrl: 'https://images.pexels.com/photos/6412475/pexels-photo-6412475.jpeg',

      cookTimeMinutes: 15,
      prepTimeMinutes: 10,

      servings: 2,

      verified: false,
    },

    categories: ['Főétel'],

    ingredients: [
      { name: 'Tonhal', quantity: 2, unit: 'konzerv' },
      { name: 'Tészta', quantity: 350, unit: 'g' },
      { name: 'Fokhagyma', quantity: 2, unit: 'gerezd' },
      { name: 'Lilahagyma', quantity: 0.5, unit: 'db' },
      { name: 'Só', quantity: 2, unit: 'csipet' },
      { name: 'Fekete bors', quantity: 0.5, unit: 'tk' },
      { name: 'Oregánó', quantity: 1, unit: 'tk' },
      { name: 'Olívaolaj', quantity: 1, unit: 'ek' },
      { name: 'Olajbogyó', quantity: 100, unit: 'g' },
      { name: 'Citrom', quantity: 0.25, unit: 'db' },
      { name: 'Petrezselyem', quantity: 1, unit: 'csokor' },
      { name: 'Paradicsom', quantity: 2, unit: 'db' },
      { name: 'Bazsalikom', quantity: 1, unit: 'tk' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Kladdkaka',

      description: 'Kladdkaka avagy a svédek brownie-ja',
      instructions:
        'Melegítsük elő a sütőt 170 °C-ra.\n\nOlvasszuk meg a vajat, majd egy tálban keverjük ki a cukorral. Adjuk hozzá a tojásokat, és dolgozzuk össze a masszát.\nSzitáljuk át a lisztet, és keverjük össze a száraz hozzávalókat.\n\nA száraz hozzávalókat 2-3 részletben adjuk a tésztához, és óvatosan forgassuk össze.\n\nÖntsük a tésztát egy piteformába, majd süssük 170 °C-on kb. 45 percig.',

      previewImageUrl: 'https://images.pexels.com/photos/30350314/pexels-photo-30350314.jpeg',

      cookTimeMinutes: 45,
      prepTimeMinutes: 15,

      servings: 4,

      verified: false,
    },

    categories: ['Desszert'],

    ingredients: [
      { name: 'Cukor', quantity: 200, unit: 'g' },
      { name: 'Vaj', quantity: 200, unit: 'g' },
      { name: 'Kakaópor', quantity: 30, unit: 'g' },
      { name: 'Búzaliszt', quantity: 220, unit: 'g' },
      { name: 'Tojás', quantity: 2, unit: 'db' },
      { name: 'Sütőpor', quantity: 1, unit: 'tk' },
      { name: 'Só', quantity: 1, unit: 'csipet' },
    ],
  },
  {
    userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH', // clerk prod environment, ppanna

    data: {
      title: 'Paradicsomleves',

      description: 'Kicsit jobb, mint az átlagos paradicsomleves.',
      instructions:
        'Melegítsük elő a sütőt 180 °C-ra.\n\nA zöldségeket vágjuk félbe, a hagymákat pucoljuk meg, majd daraboljuk kisebb részekre, és helyezzük őket egy tepsibe.\nLocsoljuk meg olajjal, majd fűszerezzük ízlés szerint.\n\nSüssük 45 percig, majd tegyünk mindent egy lábasba, és öntsük fel az alaplével. Botmixerrel turmixoljuk simára.\nHagyjuk, hogy egyet forrjon, majd tejszínnel lágyítsuk a levest.\n\nKóstoljuk meg, szükség esetén ízesítsük tovább, és már tálalhatjuk is.',

      previewImageUrl: 'https://images.pexels.com/photos/17302314/pexels-photo-17302314.jpeg',

      cookTimeMinutes: 60,
      prepTimeMinutes: 10,

      servings: 1,

      verified: true,
    },

    categories: ['Leves', 'Előétel'],

    ingredients: [
      { name: 'Paradicsom', quantity: 4, unit: 'db' },
      { name: 'Lilahagyma', quantity: 1, unit: 'db' },
      { name: 'Paprika', quantity: 2, unit: 'db' },
      { name: 'Fokhagyma', quantity: 4, unit: 'gerezd' },
      { name: 'Olívaolaj', quantity: 2, unit: 'ek' },
      { name: 'Rozmaring', quantity: 1, unit: 'csipet' },
      { name: 'Oregánó', quantity: 1, unit: 'csipet' },
      { name: 'Bazsalikom', quantity: 1, unit: 'csipet' },
      { name: 'Só', quantity: 2, unit: 'csipet' },
      { name: 'Fekete bors', quantity: 1, unit: 'csipet' },
      { name: 'Tejszín', quantity: 1, unit: 'dl' },
      { name: 'Zöldségalaplé', quantity: 2, unit: 'dkg' },
    ],
  },
  {
    userId: 'user_3CkzswbYbPXoT2B5OufMVDWwCOK', // clerk prod environment, znagy 2

    data: {
      title: 'Sós víz',

      description: 'Sós víz',
      instructions: 'Sós víz',

      previewImageUrl: 'https://images.pexels.com/photos/13466248/pexels-photo-13466248.jpeg',

      cookTimeMinutes: 0,
      prepTimeMinutes: 1,

      servings: 4,

      verified: false,
    },

    categories: ['Leves'],

    ingredients: [
      { name: 'Víz', quantity: 1, unit: 'l' },
      { name: 'Só', quantity: 1, unit: 'csipet' },
    ],
  },
] satisfies Recipe[];

export async function seedRecipes() {
  console.log('⏳ Seeding recipes...');

  const allIngredients = await db.select().from(ingredients);
  const ingredientByName = Object.fromEntries(allIngredients.map(({ id, name }) => [name, id]));

  const allUnits = await db.select({ abbreviation: units.abbreviation, id: units.id }).from(units);
  const unitByAbbr = Object.fromEntries(allUnits.map(({ abbreviation, id }) => [abbreviation, id]));

  const allCategories = await db.select().from(categories);
  const categoryByName = Object.fromEntries(allCategories.map(({ id, name }) => [name, id]));

  const existingTitles = new Set(
    (await db.select({ title: recipeData.title }).from(recipeData)).map(({ title }) => title),
  );

  for (const item of data) {
    if (existingTitles.has(item.data.title)) continue;

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
        await tx
          .insert(ingredientRecipeData)
          .values(
            item.ingredients.map((i) => {
              const ingredientId = ingredientByName[i.name];
              if (!ingredientId) throw new Error(`Ingredient not found: "${i.name}"`);

              const unitId = unitByAbbr[i.unit];
              if (!unitId) throw new Error(`Unit not found: "${i.unit}"`);

              return { ingredientId, quantity: i.quantity, recipeDataId, unitId };
            }),
          )
          .onConflictDoNothing();
      }

      if (item.categories.length > 0) {
        await tx
          .insert(categoryRecipe)
          .values(
            item.categories.map((cat) => {
              const categoryId = categoryByName[cat];
              if (!categoryId) throw new Error(`Category not found: "${cat}"`);

              return { categoryId, recipeId };
            }),
          )
          .onConflictDoNothing();
      }
    });
  }

  console.log('✅ Recipes seeded.');
}
