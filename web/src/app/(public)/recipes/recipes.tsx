'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { GET } from '~/lib/api';
import { useCreateQueryString } from '~/lib/use-create-query-string';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { data: recipes, isLoading } = useQuery({
    queryFn: () => GET(`/api/recipes?page=${page}`, paginatedRecipesSchema),
    queryKey: ['recipes', { page }],
  });

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    router.replace(pathname + '?' + createQueryString('page', currentApiPage.toString()), {
      scroll: false,
    });
  }, [currentApiPage, page, pathname, router, createQueryString]);

  return (
    <>
      {!isLoading && (!recipes || recipes.data.length === 0) && (
        <NoContent
          description="Úgy tűnik, még nincs egyetlen recept sem. Gyere vissza később!"
          title="Nincs megjeleníthető recept"
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
