import { useQuery } from '@tanstack/react-query';

import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import { paginatedRecipesSchema, type Recipe } from '~/lib/zod';

import { type FindPageSetState } from './find';

type SwipeProps = {
  ingredientIds: number[];
  setLikedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setState: FindPageSetState;
};

export function Swipe({ ingredientIds, setLikedRecipes, setState }: SwipeProps) {
  const { data: recipes, isLoading } = useQuery({
    queryFn: () => {
      const params = [
        { name: 'page', value: '1' },
        { name: 'per-page', value: '30' },
        { name: 'ingredients', value: JSON.stringify(ingredientIds) },
      ];

      return GET(`/api/recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: ['recipes', 'swipe', { ingredients: ingredientIds }],
  });

  return <div></div>;
}
