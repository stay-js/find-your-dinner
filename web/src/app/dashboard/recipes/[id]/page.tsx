import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RecipePage } from '~/app/_recipe-page';
import { createMetadata } from '~/lib/create-metadata';
import { idParamSchema } from '~/lib/zod';
import { getRecipe } from '~/server/utils/get-recipe';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  return createMetadata({
    path: `/dashboard/recipes/${id}`,

    description: recipe.recipeData.description,
    title: `Recept - ${recipe.recipeData.title}`,

    noIndex: true,
  });
}

export default RecipePage;
