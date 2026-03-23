'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import {
  type FindPageState,
  findPageStateSchema,
  idArraySearchSchema,
  type Recipe,
} from '~/lib/zod';

import { Filter } from './filter';
import { Swipe } from './swipe';
import { Tournament } from './tournament';

export type FindPageSetState = (newState: FindPageState) => void;

export function Find() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);

  const state = findPageStateSchema.parse(searchParams.get('state'));
  const ingredients = idArraySearchSchema.parse(searchParams.get('ingredients'));

  const setState = useCallback(
    (newState: FindPageState) => {
      router.replace(`${pathname}?${mergeQueryString({ state: newState })}`);
    },
    [router, pathname, mergeQueryString],
  );

  useEffect(() => {
    if (state !== 'filter' && ingredients.length === 0) {
      setState('filter');
    }
  }, [state, ingredients, setState]);

  return (
    <div className="container flex flex-col items-center gap-6 overflow-hidden py-12">
      {state === 'filter' && <Filter ingredientIds={ingredients} setState={setState} />}

      {state === 'swipe' && (
        <Swipe ingredientIds={ingredients} setLikedRecipes={setLikedRecipes} setState={setState} />
      )}

      {state === 'tournament' && <Tournament likedRecipes={likedRecipes} />}
    </div>
  );
}
