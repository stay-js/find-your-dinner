'use client';

import { FilterCombobox } from '~/components/filter-combobox';
import { useCategoriesFilter } from '~/hooks/use-categories-filter';

export function CategoriesFilter() {
  const { categories, handleCategoriesChange, selectedCategories } = useCategoriesFilter();

  return (
    <FilterCombobox
      label="Kategória"
      onValueChange={handleCategoriesChange}
      options={
        categories?.map((category) => ({
          label: category.name,
          value: category.id,
        })) ?? []
      }
      placeholder="Szűrés kategóriák szerint..."
      value={selectedCategories}
    />
  );
}
