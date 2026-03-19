import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { FilterCombobox } from '~/components/filter/filter-combobox';
import { Button } from '~/components/ui/button';
import { useMergeQueryString } from '~/hooks/use-create-query-string';
import { GET } from '~/lib/api';
import { ingredientsSchema } from '~/lib/zod/schemas';

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

  const { data: ingredients } = useQuery({
    queryFn: () => GET('/api/ingredients', ingredientsSchema),
    queryKey: ['ingredients'],
    staleTime: Infinity,
  });

  function handleIngredientsChange(values: number[]) {
    const params = [{ name: 'ingredients', value: JSON.stringify(values) }];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
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
          options={
            ingredients?.map((ingredient) => ({
              label: ingredient.name,
              value: ingredient.id,
            })) ?? []
          }
          placeholder="Hozzávalók kiválasztása..."
          value={ingredientIds}
        />

        <Button disabled={ingredientIds.length === 0} onClick={() => setState('swipe')}>
          Receptek keresése
        </Button>
      </div>
    </div>
  );
}
