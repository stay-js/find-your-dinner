import { useState } from 'react';

import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { type Recipe } from '~/lib/zod/schemas';

type TournamentProps = {
  goToSwipe: () => void;
  likedRecipes: Recipe[];
};

export function Tournament({ goToSwipe, likedRecipes }: TournamentProps) {
  const [remaining, setRemaining] = useState<Recipe[]>(likedRecipes);

  function handlePick(selectedId: number) {
    setRemaining((prev) => {
      const winnerIdx = prev.at(0)?.recipe.id === selectedId ? 0 : 1;
      const rest = prev.slice(2);

      if (rest.length === 0) return [prev[winnerIdx]!];

      return winnerIdx === 0
        ? [prev[0]!, rest[0]!, ...rest.slice(1)]
        : [rest[0]!, prev[1]!, ...rest.slice(1)];
    });
  }

  if (likedRecipes.length === 0) {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-center text-2xl font-bold">Úgy tűnik, egyetlen recept sem tetszett</h1>

        <NoContent
          action={<Button onClick={goToSwipe}>Vissza egy lépessel</Button>}
          className="py-12"
          description="Úgy tűnik, egyetlen recept sem tetszett. Kattints a lenti gombra, és próbáld újra!"
          title="Nincsenek receptek"
        />
      </div>
    );
  }

  if (remaining.length === 1) {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-center text-2xl font-bold">És a győztes recept...</h1>

        <RecipeCard pageType="search" recipe={remaining[0]!} />
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
