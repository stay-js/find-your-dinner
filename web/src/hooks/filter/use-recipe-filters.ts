import { useCategoriesFilter } from './use-categories-filter';
import { useIngredientsFilter } from './use-ingredients-filter';
import { useSearch } from './use-search';

export function useRecipeFilters() {
  const { debouncedQuery } = useSearch();
  const { selectedCategories } = useCategoriesFilter();
  const { selectedIngredients } = useIngredientsFilter();

  const hasActiveFilters =
    debouncedQuery.length > 0 || selectedCategories.length > 0 || selectedIngredients.length > 0;

  return { debouncedQuery, hasActiveFilters, selectedCategories, selectedIngredients };
}
