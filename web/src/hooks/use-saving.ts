import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DELETE, GET, POST } from '~/lib/api-utils';
import { savedRecipeIdsSchema } from '~/lib/zod-schemas';

export function useSaving() {
  const utils = useQueryClient();

  function invalidate() {
    utils.invalidateQueries({ queryKey: ['current-user-saved-recipes'] });
    utils.invalidateQueries({ queryKey: ['current-user-saved-recipe-ids'] });
  }

  const { data: savedRecipes } = useQuery({
    queryFn: () => GET('/api/current-user/saved-recipes', savedRecipeIdsSchema),
    queryKey: ['current-user-saved-recipe-ids'],
  });

  const { isPending: isSavePending, mutate: saveRecipe } = useMutation({
    mutationFn: (recipeId: number) => POST('/api/current-user/saved-recipes', { recipeId }),
    onError: () => {
      toast.error('Hiba történt a recept mentése során. Kérlek, próbáld újra később!');
    },
    onSettled: () => invalidate(),
  });

  const { isPending: isUnsavePending, mutate: unsaveRecipe } = useMutation({
    mutationFn: (recipeId: number) => DELETE(`/api/current-user/saved-recipes/${recipeId}`),
    onError: () => {
      toast.error('Hiba történt a mentett recept eltávolítása során. Kérlek, próbáld újra később!');
    },
    onSettled: () => invalidate(),
  });

  return {
    isPending: isSavePending || isUnsavePending,
    savedRecipes,
    saveRecipe,
    unsaveRecipe,
  };
}
