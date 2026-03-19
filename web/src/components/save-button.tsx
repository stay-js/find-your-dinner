'use client';

import { Bookmark } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useSaveState } from '~/hooks/use-save-state';
import { cn } from '~/lib/utils';

type SaveButtonProps = {
  className?: string;
  recipeId: number;
  variant: 'ghost' | 'outline';
};

export function SaveButton({ className, recipeId, variant }: SaveButtonProps) {
  const { handleSaveToggle, isPending, isSaved } = useSaveState(recipeId);

  return (
    <Button
      className={className}
      disabled={isPending}
      onClick={handleSaveToggle}
      size="icon"
      variant={variant}
    >
      <Bookmark className={cn('size-4.5', isSaved && 'fill-current')} />

      <span className="sr-only">
        {isSaved ? 'Törlés a mentett receptek közül' : 'Recept mentése'}
      </span>
    </Button>
  );
}
