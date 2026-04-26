import { useState } from 'react';

import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { type Recipe } from '~/lib/zod/schemas';

import { type FindPageSetState } from './find';

type TournamentProps = {
  likedRecipes: Recipe[];
  setState: FindPageSetState;
};

export function Tournament({ likedRecipes, setState }: TournamentProps) {
  const [remaining, setRemaining] = useState<Recipe[]>(likedRecipes);

  function handlePick(selectedId: number) {
    setRemaining((prev) => {
      const rightSelected = prev[1]?.recipe.id === selectedId;

      const loserIndex = rightSelected ? 0 : 1;
      const next = prev.filter((_, index) => index !== loserIndex);

      if (rightSelected && next.length >= 2) {
        return [next[1]!, next[0]!, ...next.slice(2)];
      }

      return next;
    });
  }

  if (likedRecipes.length === 0) {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-center text-2xl font-bold">Úgy tűnik, egyetlen recept sem tetszett</h1>

        <NoContent
          action={<Button onClick={() => setState('swipe')}>Vissza egy lépessel</Button>}
          className="py-12"
          description="Úgy tűnik, egyetlen recept sem tetszett. Kattints a lenti gombra, és próbáld újra!"
          title="Nincsenek receptek"
        />
      </div>
    );
  }

  const winner = remaining.length === 1 ? remaining[0] : null;

  if (winner) {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-center text-2xl font-bold">És a győztes recept...</h1>

        <RecipeCard pageType="search" recipe={winner} />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <h1 className="text-center text-2xl font-bold">Versenyezzenek a kedvenceid</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {remaining.slice(0, 2).map((recipe) => (
          <RecipeCard
            key={recipe.recipe.id}
            onSelect={handlePick}
            pageType="tournament"
            recipe={recipe}
          />
        ))}
      </div>
    </div>
  );
}
