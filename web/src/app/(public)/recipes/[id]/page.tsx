import { and, desc, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { db } from '~/server/db';
import { recipeData as recipeDataTable, recipes } from '~/server/db/schema';
import { getCategoriesForRecipe } from '~/server/utils/get-categories-for-recipe';
import { getIngredientsForRecipe } from '~/server/utils/get-ingredients-for-recipe';
import { getOwnerForRecipe } from '~/server/utils/get-owner-for-recipe';
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

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, id) });
  if (!recipe) notFound();

  const recipeData = await db.query.recipeData.findFirst({
    where: and(eq(recipeDataTable.recipeId, recipe.id), eq(recipeDataTable.verified, true)),
    orderBy: desc(recipeDataTable.createdAt),
  });

  if (!recipeData) notFound();

  const [categories, owner] = await Promise.all([
    getCategoriesForRecipe(recipe.id),
    getOwnerForRecipe(recipe.userId),
  ]);

  const ingredients = await getIngredientsForRecipe(recipeData.id);

  const { userId } = await auth();

  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[3fr_1fr]">
      <div className="flex flex-col gap-6">
        <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

        <Title
          type="public"
          isOwner={userId === recipe.userId}
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

        <Ingredients className="lg:hidden" ingredients={ingredients} />

        <Instructions instructions={recipeData.instructions} />

        <Overview
          prepTimeMinutes={recipeData.prepTimeMinutes}
          cookTimeMinutes={recipeData.cookTimeMinutes}
          createdAt={recipeData.createdAt!}
          updatedAt={recipeData.updatedAt!}
          owner={owner}
        />
      </div>

      <Ingredients className="sticky top-6 max-lg:hidden" ingredients={ingredients} />
    </div>
  );
}
