'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { PaginationComponent } from '~/components/pagination-component';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
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
    queryFn: () => GET(`/api/recipes/awaiting-verification?page=${page}`, paginatedRecipesSchema),
    queryKey: ['recipes', 'awaitingVerification', { page }],
  });

  const currentApiPage = recipes?.meta?.currentPage;

  useEffect(() => {
    if (!currentApiPage || currentApiPage === page) return;

    router.replace(pathname + '?' + createQueryString('page', currentApiPage.toString()), {
      scroll: false,
    });
  }, [currentApiPage, page, pathname, router, createQueryString]);

  if (!isLoading && (!recipes || recipes.data.length === 0)) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border py-8">
        <CheckCircle className="text-muted-foreground size-5" />

        <p className="text-center text-sm">Jelenleg nincs jóváhagyásra váró recept.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          isSidebarOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {isLoading && new Array(3).fill(null).map((_, i) => <RecipeCardSkeleton key={i} />)}

        {recipes?.data?.map((recipe) => (
          <RecipeCard key={recipe.recipe.id} pageType="admin" recipe={recipe} />
        ))}
      </div>

      <PaginationComponent currentPage={page} pageCount={recipes?.meta.pageCount || 1} />
    </>
  );
}
