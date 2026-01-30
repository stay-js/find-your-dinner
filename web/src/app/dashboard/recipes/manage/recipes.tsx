'use client';

import { useQuery } from '@tanstack/react-query';

import { RecipeCard } from '~/components/recipe-card';
import { get } from '~/lib/api-utils';
import { recipesSchema } from '~/lib/zod-schemas';

export function Recipes() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['user-recipes'],
    queryFn: () => get('/api/current-user/recipes', recipesSchema),
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading && <p>TODO: skeleton</p>}

      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.recipe.id} showIsVerified pageType="manage" recipe={recipe} />
      ))}
    </div>
  );
}
