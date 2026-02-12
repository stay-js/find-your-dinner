import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { getRecipe } from '~/server/utils/get-recipe';
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
  path: '/dashboard/admin/recipes/view',
  title: 'Recept megtekintése - Admin',
  description: 'Recept megtekintése - Admin - Find Your Dinner.',
  noIndex: true,
});

export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const { recipe, recipeData, categories, ingredients, author } = await getRecipe(id, true);

  return (
    <div className="@container">
      <div className="container grid gap-6 @5xl:grid-cols-[3fr_1fr]">
        <div className="flex flex-col gap-6">
          {!recipeData.verified && <Approve recipeDataId={recipeData.id} />}

          <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

          <Title
            isAdmin={true}
            isAuthor={userId === recipe.userId}
            recipeId={recipe.id}
            title={recipeData.title}
            description={recipeData.description}
          />

          <Categories categories={categories} />

          <Stats
            recipeId={recipe.id}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            cookTimeMinutes={recipeData.cookTimeMinutes}
            servings={recipeData.servings}
          />

          <Ingredients className="@5xl:hidden" ingredients={ingredients} />

          <Instructions instructions={recipeData.instructions} />

          <Overview
            prepTimeMinutes={recipeData.prepTimeMinutes}
            cookTimeMinutes={recipeData.cookTimeMinutes}
            createdAt={recipeData.createdAt!}
            updatedAt={recipeData.updatedAt!}
            author={author}
          />
        </div>

        <Ingredients className="sticky top-22 @max-5xl:hidden" ingredients={ingredients} />
      </div>
    </div>
  );
}
