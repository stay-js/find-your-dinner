import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { FilterCombobox } from '~/components/filter/filter-combobox';
import { Button } from '~/components/ui/button';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';
import { getDefaultIngredients, getIngredients } from '~/lib/queries';

import { type FindPageSetState } from './find';

type FilterProps = {
  ingredientIds: number[];
  setState: FindPageSetState;
};

export function Filter({ ingredientIds, setState }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const { isSignedIn } = useAuth();

  const { data: ingredients } = useQuery(getIngredients());
  const { data: defaultIngredients } = useQuery({
    ...getDefaultIngredients(),
    enabled: !!isSignedIn,
  });

  const ingredientOptions = useMemo(
    () =>
      ingredients?.map((ingredient) => ({
        label: ingredient.name,
        value: ingredient.id,
      })) ?? [],
    [ingredients],
  );

  function handleIngredientsChange(values: number[]) {
    router.replace(`${pathname}?${mergeQueryString({ ingredients: JSON.stringify(values) })}`);
  }

  function handleFillWithDefaults() {
    if (defaultIngredients && defaultIngredients.length > 0) {
      handleIngredientsChange([...new Set([...defaultIngredients, ...ingredientIds])]);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Recept keresés</h1>
        <p className="text-muted-foreground text-center">
          Válaszd ki a rendelkezésedre álló hozzávalókat, és mi megkeressük a megfelelő recepteket.
          Húzd jobbra, ha tetszik, balra, ha nem!
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <FilterCombobox
          label="Hozzávalók"
          onValueChange={handleIngredientsChange}
          options={ingredientOptions}
          placeholder="Hozzávalók kiválasztása..."
          value={ingredientIds}
        />

        {defaultIngredients && defaultIngredients.length > 0 && (
          <Button onClick={handleFillWithDefaults} variant="outline">
            Feltöltés alapértelmezett hozzávalókkal
          </Button>
        )}

        <Button disabled={ingredientIds.length === 0} onClick={() => setState('swipe')}>
          Receptek keresése
        </Button>
      </div>
    </div>
  );
}
