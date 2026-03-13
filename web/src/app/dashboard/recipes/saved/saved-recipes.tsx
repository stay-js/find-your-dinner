'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
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
import { useSidebar } from '~/components/ui/sidebar';
import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { useDebouncedCallback } from '~/hooks/use-debounce';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import { cn } from '~/lib/utils';
import {
  categoriesSchema,
  categoriesSearchSchema,
  pageSchema,
  paginatedRecipesSchema,
} from '~/lib/zod';

export function SavedRecipes() {
  const { open: isSidebarOpen } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));
  const urlQuery = searchParams.get('query')?.trim() ?? '';
  const urlCategories = categoriesSearchSchema.parse(searchParams.get('categories'));

  const [query, setQuery] = useState(urlQuery);
  const [showFilters, setShowFilters] = useState(urlCategories.length > 0);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(urlCategories);

  const { data: categories } = useQuery({
    queryFn: () => GET('/api/categories', categoriesSchema),
    queryKey: ['categories'],
    staleTime: Infinity,
  });

  const { data: savedRecipes, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = [
        { name: 'include', value: 'recipe' },
        { name: 'page', value: page.toString() },
      ];

      if (urlQuery) {
        params.push({ name: 'query', value: urlQuery });
      }

      if (urlCategories.length > 0) {
        params.push({ name: 'categories', value: JSON.stringify(urlCategories) });
      }

      return GET(`/api/user/saved-recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: [
      'currentUser',
      'savedRecipes',
      { page },
      { query: urlQuery },
      { categories: urlCategories },
    ],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const navigateQuery = useDebouncedCallback((q: string) => {
    const params = [
      { name: 'query', value: q },
      { name: 'page', value: '1' },
    ];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  });

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    navigateQuery(e.target.value);
  }

  function handleCategoriesChange(values: number[]) {
    setSelectedCategories(values);

    const params = [
      { name: 'categories', value: values.length > 0 ? JSON.stringify(values) : '[]' },
      { name: 'page', value: '1' },
    ];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  const currentApiPage = savedRecipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    const params = [{ name: 'page', value: currentApiPage.toString() }];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
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

      {!isLoading && (!savedRecipes || savedRecipes?.data.length === 0) && (
        <NoContent
          action={
            urlQuery || urlCategories.length > 0 ? undefined : (
              <Button asChild>
                <Link href="/recipes">Tovább a receptekhez</Link>
              </Button>
            )
          }
          description={
            urlQuery || urlCategories.length > 0
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nem mentettél el egyetlen receptet sem. Receptek felfedezéséhez kattints a lenti gombra.'
          }
          title={
            urlQuery || urlCategories.length > 0 ? 'Nincs találat' : 'Nincs megjeleníthető recept'
          }
        />
      )}

      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {showSkeleton && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {savedRecipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="saved" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent currentPage={page} pageCount={savedRecipes?.meta.pageCount || 1} />
    </div>
  );
}
