import { useState } from 'react';

import { RecipeCard } from '~/components/recipe-card';
import { type Recipe } from '~/lib/zod/schemas';

export function Tournament({ likedRecipes }: { likedRecipes: Recipe[] }) {
  const [remaining, setRemaining] = useState<Recipe[]>(likedRecipes);
  console.log(remaining);

  function handlePick(selectedId: number) {
    setRemaining((prev) => {
      const loserIndex = prev[0]?.recipe.id === selectedId ? 1 : 0;
      return prev.filter((_, index) => index !== loserIndex);
    });
  }

  const winner = remaining.length === 1 ? remaining[0] : null;

  const left = remaining.at(0);
  const right = remaining.at(1);

  if (winner) {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <h1 className="text-center text-2xl font-bold">És a győztes recept...</h1>

        <RecipeCard pageType="search" recipe={winner} />
      </div>
    );
  }

  if (!left || !right) return null;

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <h1 className="text-center text-2xl font-bold">Versenyezzenek a kedvenceid</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[left, right].map((recipe) => (
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
