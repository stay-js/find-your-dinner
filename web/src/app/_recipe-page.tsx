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
import { SetRecipeTitle } from '~/contexts/recipe-title-context';
import { idParamSchema } from '~/lib/zod';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipe } from '~/server/utils/get-recipe';

export async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin(userId);

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const { author, categories, ingredients, recipe, recipeData } = await getRecipe(id);

  return (
    <div className="@container">
      <SetRecipeTitle title={recipeData.title} />

      <div className="container grid gap-6 @5xl:grid-cols-[5fr_2fr] @6xl:grid-cols-[3fr_1fr]">
        <div className="flex flex-col gap-6">
          <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

          <Title
            description={recipeData.description}
            isAdmin={isAdmin}
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

          <Ingredients
            className="@5xl:hidden"
            ingredients={ingredients}
            servings={recipeData.servings}
          />

          <Instructions instructions={recipeData.instructions} />

          <Overview
            author={author}
            cookTimeMinutes={recipeData.cookTimeMinutes}
            createdAt={recipeData.createdAt!}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            updatedAt={recipeData.updatedAt!}
          />
        </div>

        <Ingredients
          className="sticky top-22 @max-5xl:hidden"
          ingredients={ingredients}
          servings={recipeData.servings}
        />
      </div>
    </div>
  );
}
