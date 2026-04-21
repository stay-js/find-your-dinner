'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { RecipeFilters } from '~/components/filter';
import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { useSidebar } from '~/components/ui/sidebar';
import { useRecipeFilters } from '~/hooks/filter';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { GET } from '~/lib/api';
import { cn } from '~/lib/utils';
import { pageSchema, paginatedSavedRecipesSchema } from '~/lib/zod';

export function SavedRecipes() {
  const { open: isSidebarOpen } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { debouncedQuery, hasActiveFilters, selectedCategories, selectedIngredients } =
    useRecipeFilters();

  const {
    data: savedRecipes,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams({
        include: 'recipe',
        page: page.toString(),
      });

      if (debouncedQuery.length > 0) {
        params.set('query', debouncedQuery);
      }

      if (selectedCategories.length > 0) {
        params.set('categories', JSON.stringify(selectedCategories));
      }

      if (selectedIngredients.length > 0) {
        params.set('ingredients', JSON.stringify(selectedIngredients));
      }

      return GET(`/api/user/saved-recipes?${params}`, paginatedSavedRecipesSchema);
    },
    queryKey: [
      'currentUser',
      'savedRecipes',
      { page },
      { query: debouncedQuery },
      { categories: selectedCategories },
      { ingredients: selectedIngredients },
    ],
  });

  const currentApiPage = savedRecipes?.meta?.currentPage;

  useEffect(() => {
    if (isPlaceholderData || !currentApiPage || currentApiPage === page) return;

    router.replace(`${pathname}?${mergeQueryString({ page: currentApiPage.toString() })}`);
  }, [isPlaceholderData, currentApiPage, page, pathname, router, mergeQueryString]);

  return (
    <div className="flex h-full flex-col gap-4">
      <RecipeFilters />

      {!isLoading && (!savedRecipes || savedRecipes?.data.length === 0) && (
        <NoContent
          action={
            hasActiveFilters ? undefined : (
              <Button asChild>
                <Link href="/recipes">Tovább a receptekhez</Link>
              </Button>
            )
          }
          description={
            hasActiveFilters
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nem mentettél el egyetlen receptet sem. Receptek felfedezéséhez kattints a lenti gombra.'
          }
          title={hasActiveFilters ? 'Nincs találat' : 'Nincs megjeleníthető recept'}
        />
      )}

      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {savedRecipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="saved" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent
        currentPage={isPlaceholderData ? (savedRecipes?.meta.currentPage ?? page) : page}
        pageCount={savedRecipes?.meta.pageCount || 1}
      />
    </div>
  );
}
