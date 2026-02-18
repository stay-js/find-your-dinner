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
import { savedRecipesSchema } from '~/lib/zod';

export function SavedRecipes() {
  const { open: isSidebarOpen } = useSidebar();

  const { data: savedRecipes, isLoading } = useQuery({
    queryFn: () => GET('/api/user/saved-recipes?include=recipe', savedRecipesSchema),
    queryKey: ['currentUser', 'savedRecipes'],
  });

  return (
    <>
      {!isLoading && (!savedRecipes || savedRecipes?.length === 0) && (
        <NoContent
          create={
            <Button asChild>
              <Link href="/">Tovább a receptekhez</Link>
            </Button>
          }
          description="Úgy tűnik, még nem mentettél el egyetlen receptet sem. Receptek felfedezéséhez kattints a lenti gombra."
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

        {savedRecipes?.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="saved" recipe={recipe} />
        ))}
      </div>
    </>
  );
}
