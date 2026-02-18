import { useSaving } from '~/hooks/use-saving';

export function useSaveState(recipeId: number) {
  const { isPending, savedRecipes, saveRecipe, unsaveRecipe } = useSaving();

  const isSaved = savedRecipes?.some((saved) => saved.recipeId === recipeId) ?? false;

  function handleSaveToggle() {
    if (isPending) return;

    if (isSaved) {
      unsaveRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
  }

  return { handleSaveToggle, isPending, isSaved };
}
