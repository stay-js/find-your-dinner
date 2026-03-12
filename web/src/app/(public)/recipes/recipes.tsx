'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FilterCombobox } from '~/components/filter-combobox';
import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { useDebouncedCallback } from '~/hooks/use-debounce';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import {
  categoriesSchema,
  categoriesSearchSchema,
  pageSchema,
  paginatedRecipesSchema,
} from '~/lib/zod';

export function Recipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));
  const urlQuery = searchParams.get('query')?.trim() ?? '';
  const urlCategories = categoriesSearchSchema.parse(searchParams.get('categories')) ?? [];

  const [query, setQuery] = useState(urlQuery);
  const [showFilters, setShowFilters] = useState(urlCategories.length > 0);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(urlCategories);

  const { data: categories } = useQuery({
    queryFn: () => GET('/api/categories', categoriesSchema),
    queryKey: ['categories'],
    staleTime: Infinity,
  });

  const { data: recipes, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = [{ name: 'page', value: page.toString() }];

      if (urlQuery) {
        params.push({ name: 'query', value: urlQuery });
      }

      if (urlCategories.length > 0) {
        params.push({ name: 'categories', value: JSON.stringify(urlCategories) });
      }

      return GET(`/api/recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: ['recipes', { page }, { query: urlQuery }, { categories: urlCategories }],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const navigateQuery = useDebouncedCallback((q: string) => {
    router.replace(
      pathname +
        '?' +
        mergeQueryString([
          { name: 'query', value: q },
          { name: 'page', value: '1' },
        ]),
    );
  });

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    navigateQuery(e.target.value);
  }

  function handleCategoriesChange(values: number[]) {
    setSelectedCategories(values);

    router.replace(
      pathname +
        '?' +
        mergeQueryString([
          {
            name: 'categories',
            value: values.length > 0 ? JSON.stringify(values) : '',
          },
          { name: 'page', value: '1' },
        ]),
    );
  }

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    router.replace(
      pathname + '?' + mergeQueryString([{ name: 'page', value: currentApiPage.toString() }]),
    );
  }, [currentApiPage, page, pathname, router, mergeQueryString]);

  return (
    <div className="flex h-full flex-col gap-4">
      <Collapsible className="flex flex-col gap-2" onOpenChange={setShowFilters} open={showFilters}>
        <div className="flex gap-2 max-sm:flex-col">
          <Input onChange={handleQueryChange} placeholder="Keresés..." value={query} />

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
            <FilterCombobox
              label="Kategória"
              onValueChange={handleCategoriesChange}
              options={
                categories?.map((category) => ({
                  label: category.name,
                  value: category.id,
                })) ?? []
              }
              placeholder="Szűrés kategóriák szerint..."
              value={selectedCategories}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {!isLoading && (!recipes || recipes.data.length === 0) && (
        <NoContent
          description={
            urlQuery || urlCategories.length > 0
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nincs egyetlen recept sem. Gyere vissza később!'
          }
          title={
            urlQuery || urlCategories.length > 0 ? 'Nincs találat' : 'Nincs megjeleníthető recept'
          }
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
