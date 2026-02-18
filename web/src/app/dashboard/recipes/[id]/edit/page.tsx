import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditPage } from '~/app/_edit-page';
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

  const recipe = await getRecipe(id, true);
  if (!recipe) notFound();

  return createMetadata({
    path: `/dashboard/recipes/${id}/edit`,

    description: 'Recept szerkesztése',
    title: 'Recept szerkesztése',

    noIndex: true,
  });
}

export default EditPage;
