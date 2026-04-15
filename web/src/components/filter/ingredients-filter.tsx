'use client';

import { Button } from '~/components/ui/button';
import { useIngredientsFilter } from '~/hooks/filter/use-ingredients-filter';

import { FilterCombobox } from './filter-combobox';

export function IngredientsFilter() {
  const {
    defaultIngredients,
    handleFillWithDefaults,
    handleIngredientsChange,
    ingredients,
    selectedIngredients,
  } = useIngredientsFilter();

  return (
    <div className="flex w-full flex-col gap-2">
      <FilterCombobox
        label="Hozzávalók"
        onValueChange={handleIngredientsChange}
        options={
          ingredients?.map((ingredient) => ({
            label: ingredient.name,
            value: ingredient.id,
          })) ?? []
        }
        placeholder="Szűrés hozzávalók szerint..."
        value={selectedIngredients}
      />

      {defaultIngredients && defaultIngredients.length > 0 && (
        <Button className="w-full" onClick={handleFillWithDefaults} size="sm" variant="outline">
          Feltöltés alapértelmezett hozzávalókkal
        </Button>
      )}

      <p className="text-muted-foreground text-xs">
        Csak azok a receptek jelennek meg, amelyek elkészíthetőek a kiválasztott hozzávalókból
        (amennyiben van kiválasztott hozzávaló).
      </p>
    </div>
  );
}
