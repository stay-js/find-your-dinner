'use client';

import { useSession } from '@clerk/nextjs';
import { ChefHat, Clock, Users } from 'lucide-react';

import { SaveButton } from '~/components/save-button';

type StatsProps = {
  recipeId: number;

  cookTimeMinutes: number;
  prepTimeMinutes: number;

  servings: number;
};

export function Stats({
  recipeId,

  cookTimeMinutes,
  prepTimeMinutes,

  servings,
}: StatsProps) {
  const { isSignedIn } = useSession();

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

      {isSignedIn && <SaveButton recipeId={recipeId} variant="outline" />}
    </div>
  );
}
