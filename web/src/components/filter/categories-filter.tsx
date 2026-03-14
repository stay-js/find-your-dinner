'use client';

import { useCategoriesFilter } from '~/hooks/filter/use-categories-filter';

import { FilterCombobox } from './filter-combobox';

export function CategoriesFilter() {
  const { categories, handleCategoriesChange, selectedCategories } = useCategoriesFilter();

  return (
    <FilterCombobox
      label="Kategóriák"
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
