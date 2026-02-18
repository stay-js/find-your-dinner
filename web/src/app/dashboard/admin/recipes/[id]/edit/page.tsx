import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditPage as AdminEditPage } from '~/app/_edit-page';
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
    path: `/dashboard/admin/recipes/${id}/edit`,

    description: 'Recept szerkesztése - Admin',
    title: 'Recept szerkesztése - Admin',

    noIndex: true,
  });
}

export default AdminEditPage;
