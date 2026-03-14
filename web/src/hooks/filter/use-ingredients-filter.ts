'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { GET } from '~/lib/api';
import { idArraySearchSchema, ingredientsSchema } from '~/lib/zod';

export function useIngredientsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const selectedIngredients = idArraySearchSchema.parse(searchParams.get('ingredients'));

  const { data: ingredients } = useQuery({
    queryFn: () => GET('/api/ingredients', ingredientsSchema),
    queryKey: ['ingredients'],
    staleTime: Infinity,
  });

  function handleIngredientsChange(values: number[]) {
    const params = [
      { name: 'ingredients', value: JSON.stringify(values) },
      { name: 'page', value: '1' },
    ];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  return { handleIngredientsChange, ingredients, selectedIngredients };
}
