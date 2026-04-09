'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { getIngredients } from '~/lib/queries';
import { idArraySearchSchema } from '~/lib/zod';

export function useIngredientsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const selectedIngredients = idArraySearchSchema.parse(searchParams.get('ingredients'));

  const { data: ingredients } = useQuery(getIngredients());

  function handleIngredientsChange(values: number[]) {
    const params = {
      ingredients: JSON.stringify(values),
      page: '1',
    };

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  return { handleIngredientsChange, ingredients, selectedIngredients };
}
