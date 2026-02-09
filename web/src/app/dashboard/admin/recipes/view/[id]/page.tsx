import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { recipeData as recipeDataTable, recipes } from '~/server/db/schema';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';
import { getOwnerForRecipe } from '~/server/utils/get-owner-for-recipe';
import { getIngredientsForRecipe } from '~/server/utils/get-ingredients-for-recipe';
import {
  Categories,
  Ingredients,
  Instructions,
  Overview,
  PreviewImage,
  Stats,
  Title,
} from '~/components/recipe-page';
import { idParamSchema } from '~/lib/zod-schemas';
import { createMetadata } from '~/lib/create-metadata';
import { Approve } from './approve';

export const metadata = createMetadata({
  path: '/dashboard/admin/view',
  title: 'Recept megtekintése - Admin',
  description: 'Recept megtekintése - Admin',
  noIndex: true,
});

export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });
  if (!recipe) notFound();

  const recipeData = await db.query.recipeData.findFirst({
    where: eq(recipeDataTable.recipeId, recipe.id),
    orderBy: desc(recipeDataTable.createdAt),
  });

  if (!recipeData) notFound();

  const [categories, owner] = await Promise.all([
    getCategoriesForRecipe(recipe.id),
    getOwnerForRecipe(recipe.userId),
  ]);

  const ingredients = await getIngredientsForRecipe(recipeData.id);

  return (
    <div className="container grid gap-6 xl:grid-cols-[3fr_1fr]">
      <div className="flex flex-col gap-6">
        {!recipeData.verified && <Approve recipeDataId={recipeData.id} />}

        <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

        <Title
          type="admin"
          recipeId={recipe.id}
          title={recipeData.title}
          description={recipeData.description}
        />

        <Categories categories={categories} />

        <Stats
          prepTimeMinutes={recipeData.prepTimeMinutes}
          cookTimeMinutes={recipeData.cookTimeMinutes}
          servings={recipeData.servings}
        />

        <Ingredients className="xl:hidden" ingredients={ingredients} />

        <Instructions instructions={recipeData.instructions} />

        <Overview
          prepTimeMinutes={recipeData.prepTimeMinutes}
          cookTimeMinutes={recipeData.cookTimeMinutes}
          createdAt={recipeData.createdAt!}
          updatedAt={recipeData.updatedAt!}
          owner={owner}
        />
      </div>

      <Ingredients className="sticky top-22 max-xl:hidden" ingredients={ingredients} />
    </div>
  );
}
