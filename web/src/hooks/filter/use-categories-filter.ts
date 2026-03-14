'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { GET } from '~/lib/api';
import { categoriesSchema, idArraySearchSchema } from '~/lib/zod';

export function useCategoriesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const selectedCategories = idArraySearchSchema.parse(searchParams.get('categories'));

  const { data: categories } = useQuery({
    queryFn: () => GET('/api/categories', categoriesSchema),
    queryKey: ['categories'],
    staleTime: Infinity,
  });

  function handleCategoriesChange(values: number[]) {
    const params = [
      { name: 'categories', value: JSON.stringify(values) },
      { name: 'page', value: '1' },
    ];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  return { categories, handleCategoriesChange, selectedCategories };
}
