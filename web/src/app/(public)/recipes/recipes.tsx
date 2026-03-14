'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CategoriesFilter } from '~/components/categories-filter';
import { IngredientsFilter } from '~/components/ingredients-filter';
import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Search } from '~/components/search';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { useCategoriesFilter } from '~/hooks/use-categories-filter';
import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { useIngredientsFilter } from '~/hooks/use-ingredients-filter';
import { useSearch } from '~/hooks/use-search';
import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { selectedCategories } = useCategoriesFilter();
  const { selectedIngredients } = useIngredientsFilter();
  const { debouncedQuery } = useSearch();

  const [showFilters, setShowFilters] = useState(
    selectedCategories.length > 0 || selectedIngredients.length > 0,
  );

  const { data: recipes, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = [{ name: 'page', value: page.toString() }];

      if (debouncedQuery) {
        params.push({ name: 'query', value: debouncedQuery });
      }

      if (selectedCategories.length > 0) {
        params.push({ name: 'categories', value: JSON.stringify(selectedCategories) });
      }

      if (selectedIngredients.length > 0) {
        params.push({ name: 'ingredients', value: JSON.stringify(selectedIngredients) });
      }

      return GET(`/api/recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: [
      'recipes',
      { page },
      { query: debouncedQuery },
      { categories: selectedCategories },
      { ingredients: selectedIngredients },
    ],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    const params = [{ name: 'page', value: currentApiPage.toString() }];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }, [currentApiPage, page, pathname, router, mergeQueryString]);

  const hasActiveFilters =
    debouncedQuery.length > 0 || selectedCategories.length > 0 || selectedIngredients.length > 0;

  return (
    <div className="flex h-full flex-col gap-4">
      <Collapsible className="flex flex-col gap-2" onOpenChange={setShowFilters} open={showFilters}>
        <div className="flex gap-2 max-sm:flex-col">
          <Search />

          <CollapsibleTrigger asChild>
            <Button onClick={() => setShowFilters((val) => !val)} variant="outline">
              {showFilters ? <EyeOff /> : <Eye />}
              <span>Szűrők</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="border-input flex flex-col gap-4 rounded-md border p-4">
          <h2 className="text-lg font-semibold">Szűrők</h2>

          <div className="flex flex-col gap-2 lg:flex-row">
            <CategoriesFilter />
            <IngredientsFilter />
          </div>
        </CollapsibleContent>
      </Collapsible>

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
        {showSkeleton && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="search" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent currentPage={page} pageCount={recipes?.meta.pageCount || 1} />
    </div>
  );
}
