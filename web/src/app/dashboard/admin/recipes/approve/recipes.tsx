'use client';

import { useQuery } from '@tanstack/react-query';

import { useSidebar } from '~/components/ui/sidebar';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { recipesSchema } from '~/lib/zod-schemas';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes-to-approve'],
    queryFn: () => GET('/api/admin/recipes/to-approve', recipesSchema),
  });

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6',
        isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.recipe.id} pageType="admin" recipe={recipe} showIsVerified />
      ))}
    </div>
  );
}
