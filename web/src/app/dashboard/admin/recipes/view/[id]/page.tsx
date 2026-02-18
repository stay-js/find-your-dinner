import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import {
  Categories,
  Ingredients,
  Instructions,
  Overview,
  PreviewImage,
  Stats,
  Title,
} from '~/components/recipe-page';
import { createMetadata } from '~/lib/create-metadata';
import { idParamSchema } from '~/lib/zod-schemas';
import { getRecipe } from '~/server/utils/get-recipe';

import { Approve } from './approve';

export const metadata = createMetadata({
  path: '/dashboard/admin/recipes/view',

  description: 'Recept megtekintése - Admin - Find Your Dinner.',
  title: 'Recept megtekintése - Admin',

  noIndex: true,
});

export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const { author, categories, ingredients, recipe, recipeData } = await getRecipe(id, true);

  return (
    <div className="@container">
      <div className="container grid gap-6 @5xl:grid-cols-[3fr_1fr]">
        <div className="flex flex-col gap-6">
          {!recipeData.verified && <Approve recipeDataId={recipeData.id} />}

          <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

          <Title
            description={recipeData.description}
            isAdmin={true}
            isAuthor={userId === recipe.userId}
            recipeId={recipe.id}
            title={recipeData.title}
          />

          <Categories categories={categories} />

          <Stats
            cookTimeMinutes={recipeData.cookTimeMinutes}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            recipeId={recipe.id}
            servings={recipeData.servings}
          />

          <Ingredients className="@5xl:hidden" ingredients={ingredients} />

          <Instructions instructions={recipeData.instructions} />

          <Overview
            author={author}
            cookTimeMinutes={recipeData.cookTimeMinutes}
            createdAt={recipeData.createdAt!}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            updatedAt={recipeData.updatedAt!}
          />
        </div>

        <Ingredients className="sticky top-22 @max-5xl:hidden" ingredients={ingredients} />
      </div>
    </div>
  );
}
