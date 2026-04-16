'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { getDefaultIngredients, getIngredients } from '~/lib/queries';
import { idArraySearchSchema } from '~/lib/zod';

export function useIngredientsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const { isSignedIn } = useAuth();

  const selectedIngredients = idArraySearchSchema.parse(searchParams.get('ingredients'));

  const { data: ingredients } = useQuery(getIngredients());
  const { data: defaultIngredients } = useQuery({
    ...getDefaultIngredients(),
    enabled: !!isSignedIn,
  });

  function handleIngredientsChange(values: number[]) {
    const params = {
      ingredients: JSON.stringify(values),
      page: '1',
    };

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  function handleFillWithDefaults() {
    if (defaultIngredients && defaultIngredients.length > 0) {
      handleIngredientsChange([...new Set([...defaultIngredients, ...selectedIngredients])]);
    }
  }

  return {
    defaultIngredients,
    handleFillWithDefaults,
    handleIngredientsChange,
    ingredients,
    selectedIngredients,
  };
}
