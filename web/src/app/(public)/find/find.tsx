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

  function goToSwipe() {
    setState('swipe');
    setLikedRecipes([]);
  }

  function goToTournament() {
    setState('tournament');
  }

  function goToFilter() {
    setState('filter');
    setLikedRecipes([]);
  }

  useEffect(() => {
    if (state !== 'filter' && ingredients.length === 0) {
      setState('filter');
    }
  }, [state, ingredients, setState]);

  return (
    <div className="container flex flex-col items-center gap-6 overflow-hidden py-16">
      {state === 'filter' && <Filter goToSwipe={goToSwipe} ingredientIds={ingredients} />}

      {state === 'swipe' && (
        <Swipe
          goToFilter={goToFilter}
          goToTournament={goToTournament}
          ingredientIds={ingredients}
          setLikedRecipes={setLikedRecipes}
        />
      )}

      {state === 'tournament' && <Tournament goToSwipe={goToSwipe} likedRecipes={likedRecipes} />}
    </div>
  );
}
