'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';

import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { useSidebar } from '~/components/ui/sidebar';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';
import { recipesSchema } from '~/lib/zod';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: recipes, isLoading } = useQuery({
    queryFn: () => GET('/api/admin/recipe-data/to-approve', recipesSchema),
    queryKey: ['recipe-data-to-approve'],
  });

  if (!isLoading && (!recipes || recipes.length === 0)) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border py-8">
        <CheckCircle className="text-muted-foreground size-5" />

        <p className="text-center text-sm">Jelenleg nincs jóváhagyásra váró recept.</p>
      </div>
    );
  }

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
