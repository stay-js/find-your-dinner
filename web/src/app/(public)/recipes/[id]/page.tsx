import { auth } from '@clerk/nextjs/server';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RecipePage } from '~/components/recipe-page';
import { createMetadata } from '~/lib/create-metadata';
import { idParamSchema } from '~/lib/zod';
import { checkIsAdmin } from '~/server/utils/check-is-admin';
import { getRecipe } from '~/server/utils/recipe-helpers';

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
    path: `/recipes/${id}`,

    description: recipe.recipeData.description,
    title: `Recept - ${recipe.recipeData.title}`,
  });
}

export default async function PublicRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin(userId);

  const result = idParamSchema.safeParse(await params);
  if (!result.success) notFound();

  const { id } = result.data;

  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  return <RecipePage className="pt-6" {...recipe} isAdmin={isAdmin} userId={userId} />;
}
