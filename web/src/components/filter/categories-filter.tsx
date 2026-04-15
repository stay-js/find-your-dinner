'use client';

import { useMemo } from 'react';

import { useCategoriesFilter } from '~/hooks/filter/use-categories-filter';

import { FilterCombobox } from './filter-combobox';

export function CategoriesFilter() {
  const { categories, handleCategoriesChange, selectedCategories } = useCategoriesFilter();

  const categoryOptions = useMemo(
    () =>
      categories?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? [],
    [categories],
  );

  return (
    <FilterCombobox
      label="Kategóriák"
      onValueChange={handleCategoriesChange}
      options={categoryOptions}
      placeholder="Szűrés kategóriák szerint..."
      value={selectedCategories}
    />
  );
}
