'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { NoContent } from '~/components/no-content';
import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { useSidebar } from '~/components/ui/sidebar';
import { useCreateQueryString } from '~/hooks/use-create-query-string';
import { GET } from '~/lib/api';
import { cn } from '~/lib/utils';
import { pageSchema, paginatedRecipesSchema } from '~/lib/zod';

export function Recipes() {
  const { open: isSidebarOpen } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const page = pageSchema.parse(searchParams.get('page'));

  const { data: recipes, isLoading } = useQuery({
    queryFn: () => GET(`/api/user/recipes?page=${page}`, paginatedRecipesSchema),
    queryKey: ['currentUser', 'recipes', { page }],
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
      {!isLoading && (!recipes || recipes?.data?.length === 0) && (
        <NoContent
          action={
            <Button asChild>
              <Link href="/dashboard/recipes/create">Recept létrehozása</Link>
            </Button>
          }
          description="Úgy tűnik, még nem hoztál létre egyetlen receptet sem. Az alábbi gombra kattintva megteheted."
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

        {recipes?.data?.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="manage" recipe={recipe} showIsVerified />
        ))}
      </div>

      <PaginationComponent currentPage={page} pageCount={recipes?.meta.pageCount || 1} />
    </>
  );
}
