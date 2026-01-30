'use client';

import { useQuery } from '@tanstack/react-query';

import { RecipeCard } from '~/components/recipe-card';
import { get } from '~/lib/api-utils';
import { recipesSchema, savedRecipesSchema } from '~/lib/zod-schemas';

export function Recipes() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['current-user-recipes'],
    queryFn: () => get('/api/current-user/recipes', recipesSchema),
  });

  const { data: savedRecipes } = useQuery({
    queryKey: ['current-user-saved-recipes'],
    queryFn: () => get('/api/current-user/saved-recipes', savedRecipesSchema),
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading && <p>TODO: skeleton</p>}

      {recipes?.map((recipe) => (
        <RecipeCard
          key={recipe.recipe.id}
          pageType="manage"
          recipe={recipe}
          isSaved={savedRecipes?.some((saved) => saved.recipeId === recipe.recipe.id) ?? false}
          showIsVerified
        />
      ))}
    </div>
  );
}
