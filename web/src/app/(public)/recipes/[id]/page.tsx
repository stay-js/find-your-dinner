import { Recipe } from './recipe';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <Recipe recipeId={id} />;
}
