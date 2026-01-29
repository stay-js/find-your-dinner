import { RecipeCard } from '~/components/recipe-card';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard/recipes/manage',
  title: 'Recepteim kezelése - Find Your Dinner.',
  description: 'Recepteim kezelése - Find Your Dinner.',
  noIndex: true,
});

const sampleRecipes = [
  {
    recipeId: 1,
    title: 'Klasszikus Margherita pizza',
    description:
      'Hagyományos olasz pizza friss mozzarellával, San Marzano paradicsommal és illatos bazsalikomlevelekkel, tökéletesen ropogós tésztán.',
    previewImageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80',
    prepTimeMinutes: 30,
    cookTimeMinutes: 15,
    servings: 4,
    verified: true,
    categories: [
      {
        id: 5,
        name: 'Főétel',
      },
    ],
    isSaved: false,
  },
  {
    recipeId: 2,
    title: 'Thai zöld curry',
    description:
      'Illatos és krémes kókusztejes curry omlós csirkehússal, bambuszrügyekkel és thai bazsalikommal.',
    previewImageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 4,
    verified: true,
    categories: [
      {
        id: 5,
        name: 'Főétel',
      },
    ],
    isSaved: true,
  },
  {
    recipeId: 3,
    title: 'Házi csokoládés brownie',
    description: 'Gazdag, szaftos brownie ropogós tetejével és olvadt csokoládédarabokkal.',
    previewImageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 12,
    verified: false,
    categories: [
      {
        id: 8,
        name: 'Desszert',
      },
    ],
    isSaved: false,
  },
];

export default async function ManagePage() {
  return (
    <div>
      <h1>Recepteim kezelése</h1>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleRecipes.map((recipe) => (
          <RecipeCard key={recipe.recipeId} showIsVerified pageType="manage" {...recipe} />
        ))}
      </div>
    </div>
  );
}
