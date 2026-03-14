'use client';

import { FilterCombobox } from '~/components/filter-combobox';
import { useIngredientsFilter } from '~/hooks/use-ingredients-filter';

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
