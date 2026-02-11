import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { savedRecipeIdsSchema } from '~/lib/zod-schemas';
import { GET, POST, DELETE } from '~/lib/api-utils';

export function useSaving() {
  const utils = useQueryClient();

  function invalidate() {
    utils.invalidateQueries({ queryKey: ['current-user-saved-recipes'] });
    utils.invalidateQueries({ queryKey: ['current-user-saved-recipe-ids'] });
  }

  const { data: savedRecipes } = useQuery({
    queryKey: ['current-user-saved-recipe-ids'],
    queryFn: () => GET('/api/current-user/saved-recipes', savedRecipeIdsSchema),
  });

  const { mutate: saveRecipe, isPending: isSavePending } = useMutation({
    mutationFn: (recipeId: number) => POST('/api/current-user/saved-recipes', { recipeId }),
    onSettled: () => invalidate(),
    onError: () => {
      toast.error('Hiba történt a recept mentése során. Kérlek, próbáld újra később!');
    },
  });

  const { mutate: unsaveRecipe, isPending: isUnsavePending } = useMutation({
    mutationFn: (recipeId: number) => DELETE(`/api/current-user/saved-recipes/${recipeId}`),
    onSettled: () => invalidate(),
    onError: () => {
      toast.error('Hiba történt a mentett recept eltávolítása során. Kérlek, próbáld újra később!');
    },
  });

  return {
    savedRecipes,
    isPending: isSavePending || isUnsavePending,
    saveRecipe,
    unsaveRecipe,
  };
}
