'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { useCreateQueryString } from '~/hooks/use-create-query-string';
import { useDebouncedCallback } from '~/hooks/use-debounce';
import { GET } from '~/lib/api';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));
  const urlQuery = searchParams.get('query')?.trim() ?? '';

  const [query, setQuery] = useState(urlQuery);
  const [showFilters, setShowFilters] = useState(false);

  const { data: recipes, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      GET(
        `/api/recipes?page=${page}&query=${encodeURIComponent(urlQuery)}`,
        paginatedRecipesSchema,
      ),
    queryKey: ['recipes', { page }, { query: urlQuery }],
  });

  const navigateQuery = useDebouncedCallback((q: string) => {
    router.replace(
      pathname +
        '?' +
        createQueryString([
          { name: 'query', value: q },
          { name: 'page', value: '1' },
        ]),
    );
  });

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    navigateQuery(e.target.value);
  }

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    router.replace(
      pathname + '?' + createQueryString([{ name: 'page', value: currentApiPage.toString() }]),
    );
  }, [currentApiPage, page, pathname, router, createQueryString]);

  return (
    <>
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

          <div className="flex flex-col gap-2 lg:flex-row"></div>
        </CollapsibleContent>
      </Collapsible>

      {!isLoading && (!recipes || recipes.data.length === 0) && (
        <NoContent
          description={
            urlQuery
              ? 'Sajnos nincs a keresési feltételeknek megfelelő recept. Próbáld meg módosítani a keresési feltételeket.'
              : 'Úgy tűnik, még nincs egyetlen recept sem. Gyere vissza később!'
          }
          title={urlQuery ? 'Nincs találat' : 'Nincs megjeleníthető recept'}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.data.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="search" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent currentPage={page} pageCount={recipes?.meta.pageCount || 1} />
    </>
  );
}
