'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { useSidebar } from '~/components/ui/sidebar';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';
import { recipesSchema } from '~/lib/zod';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: recipes, isLoading } = useQuery({
    queryFn: () => GET('/api/user/recipes', recipesSchema),
    queryKey: ['currentUser', 'recipes'],
  });

  return (
    <>
      {!isLoading && (!recipes || recipes?.length === 0) && (
        <NoContent
          create={
            <Button asChild>
              <Link href="/dashboard/recipes/create">Recept létrehozása</Link>
            </Button>
          }
          description="Úgy tűnik, még nem hoztál létre egyetlen receptet sem. Az alábbi gombra kattintva megteheted."
          title="Nincs megjeleníthető recept"
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
