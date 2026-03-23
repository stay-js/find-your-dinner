'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { OnlyAwaitingVerificationFilter, RecipeFilters } from '~/components/filter';
import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { useSidebar } from '~/components/ui/sidebar';
import { useOnlyAwaitingVerificationFilter, useRecipeFilters } from '~/hooks/filter';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import { cn } from '~/lib/utils';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { onlyAwaitingVerification } = useOnlyAwaitingVerificationFilter();
  const { debouncedQuery, hasActiveFilters, selectedCategories, selectedIngredients } =
    useRecipeFilters();

  const {
    data: recipes,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = [
        { name: 'allow-unverified', value: 'true' },
        { name: 'page', value: page.toString() },
      ];

      if (debouncedQuery.length > 0) {
        params.push({ name: 'query', value: debouncedQuery });
      }

      if (selectedCategories.length > 0) {
        params.push({ name: 'categories', value: JSON.stringify(selectedCategories) });
      }

      if (selectedIngredients.length > 0) {
        params.push({ name: 'ingredients', value: JSON.stringify(selectedIngredients) });
      }

      if (onlyAwaitingVerification) {
        params.push({ name: 'only-awaiting-verification', value: 'true' });
      }

      return GET(`/api/recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: [
      'recipes',
      'admin',
      { page },
      { query: debouncedQuery },
      { categories: selectedCategories },
      { ingredients: selectedIngredients },
      { onlyAwaitingVerification },
    ],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    router.replace(`${pathname}?${mergeQueryString({ page: currentApiPage.toString() })}`);
  }, [currentApiPage, page, pathname, router, mergeQueryString]);

  return (
    <div className="flex h-full flex-col gap-4">
      <RecipeFilters extraFilterActive={onlyAwaitingVerification}>
        <OnlyAwaitingVerificationFilter />
      </RecipeFilters>

      {!isLoading && (!recipes || recipes.data.length === 0) && (
        <NoContent
          description={
            hasActiveFilters
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nincs egyetlen recept sem.'
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
        {showSkeleton && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="admin" recipe={recipe} showIsVerified />
        ))}
      </div>

      <PaginationComponent
        currentPage={isPlaceholderData ? (recipes?.meta.currentPage ?? page) : page}
        pageCount={recipes?.meta.pageCount || 1}
      />
    </div>
  );
}
