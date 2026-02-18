'use client';

import { Bookmark, ChefHat, Clock, Users } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useSaveState } from '~/hooks/use-save-state';
import { cn } from '~/lib/utils';

export function Stats({
  recipeId,

  cookTimeMinutes,
  prepTimeMinutes,

  servings,
}: {
  recipeId: number;

  cookTimeMinutes: number;
  prepTimeMinutes: number;

  servings: number;
}) {
  const { handleSaveToggle, isPending, isSaved } = useSaveState(recipeId);

  return (
    <div className="flex justify-between gap-6 max-sm:flex-col">
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground size-5" />

          <div className="text-sm font-medium">Előkészítés: {prepTimeMinutes} perc</div>
        </div>

        <div className="flex items-center gap-2">
          <ChefHat className="text-muted-foreground size-5" />

          <div className="text-sm font-medium">Főzés/Sütés: {cookTimeMinutes} perc</div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground size-5" />

          <div className="text-sm font-medium">{servings} adag</div>
        </div>
      </div>

      <Button disabled={isPending} onClick={handleSaveToggle} size="icon-sm" variant="outline">
        <Bookmark className={cn('size-4', isSaved && 'fill-current')} />

        <span className="sr-only">
          {isSaved ? 'Törlés a mentett receptek közül' : 'Recept mentése'}
        </span>
      </Button>
    </div>
  );
}
