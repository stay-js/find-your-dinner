'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { useSidebar } from '~/components/ui/sidebar';
import { Button } from '~/components/ui/button';
import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { recipesSchema } from '~/lib/zod-schemas';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['current-user-recipes'],
    queryFn: () => GET('/api/current-user/recipes', recipesSchema),
  });

  return (
    <>
      {!isLoading && (!recipes || recipes?.length === 0) && (
        <NoContent
          title="Nincs megjeleníthető recept"
          description="Úgy tűnik, még nem hoztál létre egyetlen receptet sem. Az alábbi gombra kattintva megteheted."
          create={
            <Button asChild>
              <Link href="/dashboard/recipes/create">Recept létrehozása</Link>
            </Button>
          }
        />
      )}

      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="manage" recipe={recipe} showIsVerified />
        ))}
      </div>
    </>
  );
}
