import { auth } from '@clerk/nextjs/server';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RecipePage } from '~/components/recipe-page';
import { createMetadata } from '~/lib/create-metadata';
import { idParamSchema } from '~/lib/zod';
import { getRecipe } from '~/server/utils/get-recipe';

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

  const data = await getRecipe(id, true);

  return (
    <RecipePage {...data} isAdmin={true} userId={userId}>
      {!data.recipeData.verified && <Approve recipeDataId={data.recipeData.id} />}
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
