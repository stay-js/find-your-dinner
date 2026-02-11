import { and, desc, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

import { db } from '~/server/db';
import { recipeData as recipeDataTable, recipes } from '~/server/db/schema';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import {
  getRecipeAuthor,
  getRecipeCategories,
  getRecipeIngredients,
} from '~/server/utils/recipe-helpers';
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
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin(userId);

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipeRecords = await db
    .select({
      recipe: recipes,
      recipeData: recipeDataTable,
    })
    .from(recipes)
    .innerJoin(
      recipeDataTable,
      and(eq(recipeDataTable.recipeId, recipes.id), eq(recipeDataTable.verified, true)),
    )
    .where(eq(recipes.id, id))
    .orderBy(desc(recipes.createdAt));

  if (!recipeRecords?.[0]) notFound();

  const { recipe, recipeData } = recipeRecords[0];

  const [categories, ingredients, author] = await Promise.all([
    getRecipeCategories(recipe.id),
    getRecipeIngredients(recipeData.id),
    getRecipeAuthor(recipe.userId),
  ]);

  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[3fr_1fr]">
      <div className="flex flex-col gap-6">
        <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

        <Title
          isAdmin={isAdmin}
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

        <Ingredients className="lg:hidden" ingredients={ingredients} />

        <Instructions instructions={recipeData.instructions} />

        <Overview
          prepTimeMinutes={recipeData.prepTimeMinutes}
          cookTimeMinutes={recipeData.cookTimeMinutes}
          createdAt={recipeData.createdAt!}
          updatedAt={recipeData.updatedAt!}
          author={author}
        />
      </div>

      <Ingredients className="sticky top-6 max-lg:hidden" ingredients={ingredients} />
    </div>
  );
}
