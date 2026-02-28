'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DELETE, GET, POST } from '~/lib/api';
import { savedRecipeIdsSchema } from '~/lib/zod';

export function useSaving() {
  const utils = useQueryClient();

  function invalidate() {
    utils.invalidateQueries({ queryKey: ['currentUser', 'savedRecipes'] });
    utils.invalidateQueries({ queryKey: ['currentUser', 'savedRecipeIds'] });
  }

  const { data: savedRecipes } = useQuery({
    queryFn: () => GET('/api/user/saved-recipes', savedRecipeIdsSchema),
    queryKey: ['currentUser', 'savedRecipeIds'],
  });

  const { isPending: isSavePending, mutate: saveRecipe } = useMutation({
    mutationFn: (recipeId: number) => POST('/api/user/saved-recipes', { recipeId }),
    onError: () => {
      toast.error('Hiba történt a recept mentése során. Kérlek, próbáld újra később!');
    },
    onSettled: () => invalidate(),
  });

  const { isPending: isUnsavePending, mutate: unsaveRecipe } = useMutation({
    mutationFn: (recipeId: number) => DELETE(`/api/user/saved-recipes/${recipeId}`),
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
