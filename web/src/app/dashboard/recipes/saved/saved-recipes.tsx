'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { useSidebar } from '~/components/ui/sidebar';
import { Button } from '~/components/ui/button';
import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { savedRecipesSchema } from '~/lib/zod-schemas';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';

export function SavedRecipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: savedRecipes, isLoading } = useQuery({
    queryKey: ['current-user-saved-recipes'],
    queryFn: () => GET('/api/current-user/saved-recipes?include=recipe', savedRecipesSchema),
  });

  return (
    <>
      {!isLoading && (!savedRecipes || savedRecipes?.length === 0) && (
        <NoContent
          title="Nincs megjeleníthető recept"
          description="Úgy tűnik, még nem mentettél el egyetlen receptet sem. Receptek felfedezéséhez kattints a lenti gombra."
          create={
            <Button asChild>
              <Link href="/">Tovább a receptekhez</Link>
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

        {savedRecipes?.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="saved" recipe={recipe} />
        ))}
      </div>
    </>
  );
}
