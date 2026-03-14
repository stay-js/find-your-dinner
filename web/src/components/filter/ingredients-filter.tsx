'use client';

import { useIngredientsFilter } from '~/hooks/filter/use-ingredients-filter';

import { FilterCombobox } from './filter-combobox';

export function IngredientsFilter() {
  const { handleIngredientsChange, ingredients, selectedIngredients } = useIngredientsFilter();

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

      <p className="text-muted-foreground text-xs">
        Csak azok a receptek jelennek meg, amelyek elkészíthetők a kiválasztott hozzávalókból
        (amennyiben van kiválasztott hozzávaló).
      </p>
    </div>
  );
}
