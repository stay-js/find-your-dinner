'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { RecipeFilters } from '~/components/filter';
import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { useRecipeFilters } from '~/hooks/filter';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { GET } from '~/lib/api';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { debouncedQuery, hasActiveFilters, selectedCategories, selectedIngredients } =
    useRecipeFilters();

  const {
    data: recipes,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams({ page: page.toString() });

      if (debouncedQuery.length > 0) {
        params.set('query', debouncedQuery);
      }

      if (selectedCategories.length > 0) {
        params.set('categories', JSON.stringify(selectedCategories));
      }

      if (selectedIngredients.length > 0) {
        params.set('ingredients', JSON.stringify(selectedIngredients));
      }

      return GET(`/api/recipes?${params}`, paginatedRecipesSchema);
    },
    queryKey: [
      'recipes',
      { page },
      { query: debouncedQuery },
      { categories: selectedCategories },
      { ingredients: selectedIngredients },
    ],
  });

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (isPlaceholderData || !currentApiPage || currentApiPage === page) return;

    router.replace(`${pathname}?${mergeQueryString({ page: currentApiPage.toString() })}`);
  }, [isPlaceholderData, currentApiPage, page, pathname, router, mergeQueryString]);

  return (
    <div className="flex h-full flex-col gap-4">
      <RecipeFilters />

      {!isLoading && (!recipes || recipes.data.length === 0) && (
        <NoContent
          description={
            hasActiveFilters
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nincs egyetlen recept sem. Gyere vissza később!'
          }
          title={hasActiveFilters ? 'Nincs találat' : 'Nincs megjeleníthető recept'}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="search" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent
        currentPage={isPlaceholderData ? (recipes?.meta.currentPage ?? page) : page}
        pageCount={recipes?.meta.pageCount || 1}
      />
    </div>
  );
}
