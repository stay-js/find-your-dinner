import { queryOptions } from '@tanstack/react-query';

import { GET } from '~/lib/api';
import {
  categoriesSchema,
  defaultIngredientIdsSchema,
  ingredientsSchema,
  unitsSchema,
} from '~/lib/zod';

export function getCategories() {
  return queryOptions({
    queryFn: () => GET('/api/categories', categoriesSchema),
    queryKey: ['categories'],
    staleTime: Infinity,
  });
}

export function getDefaultIngredients() {
  return queryOptions({
    queryFn: () => GET('/api/user/default-ingredients', defaultIngredientIdsSchema),
    queryKey: ['currentUser', 'default-ingredients'],
    staleTime: Infinity,
  });
}

export function getIngredients() {
  return queryOptions({
    queryFn: () => GET('/api/ingredients', ingredientsSchema),
    queryKey: ['ingredients'],
    staleTime: Infinity,
  });
}

export function getUnits() {
  return queryOptions({
    queryFn: () => GET('/api/units', unitsSchema),
    queryKey: ['units'],
    staleTime: Infinity,
  });
}
