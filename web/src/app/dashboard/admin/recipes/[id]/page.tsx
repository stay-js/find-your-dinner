import { auth } from '@clerk/nextjs/server';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RecipePage } from '~/components/recipe-page';
import { createMetadata } from '~/lib/create-metadata';
import { idParamSchema } from '~/lib/zod';
import { getRecipe } from '~/server/utils/recipe-helpers';

import { Approve } from './approve';

export default async function DashboardAdminRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await getRecipe(id, true);
  if (!recipe) notFound();

  return (
    <RecipePage {...recipe} isAdmin={true} userId={userId}>
      <Approve recipeDataId={recipe.recipeData.id} visible={!recipe.recipeData.verified} />
    </RecipePage>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await getRecipe(id, true);
  if (!recipe) notFound();

  return createMetadata({
    path: `/dashboard/admin/recipes/${id}`,

    description: recipe.recipeData.description,
    title: `Recept - ${recipe.recipeData.title}`,

    noIndex: true,
  });
}
