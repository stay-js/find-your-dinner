import { useQuery } from '@tanstack/react-query';
import { type PanInfo } from 'motion/react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { NoContent } from '~/components/no-content';
import { RecipeCard } from '~/components/recipe-card';
import { RecipeCardSkeleton } from '~/components/recipe-card-skeleton';
import { Button } from '~/components/ui/button';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { GET } from '~/lib/api';
import { buildQueryString } from '~/lib/build-query-string';
import { paginatedRecipesSchema, type Recipe } from '~/lib/zod';

import { type FindPageSetState } from './find';

const RECIPE_LIMIT = 30;

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

type AnimatedCardProps = {
  onDislike: () => void;
  onLike: (recipe: Recipe) => void;
  recipe: Recipe;
};

type SwipeProps = {
  ingredientIds: number[];
  setLikedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setState: FindPageSetState;
};

export function Swipe({ ingredientIds, setLikedRecipes, setState }: SwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: recipes, isLoading } = useQuery({
    queryFn: () => {
      const params = [
        { name: 'page', value: '1' },
        { name: 'per-page', value: RECIPE_LIMIT.toString() },
        { name: 'ingredients', value: JSON.stringify(ingredientIds) },
      ];

      return GET(`/api/recipes?${buildQueryString(params)}`, paginatedRecipesSchema);
    },
    queryKey: ['recipes', 'swipe', { ingredients: ingredientIds }],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const allRecipes = useMemo(() => recipes?.data ?? [], [recipes]);

  const noRecipes = allRecipes.length < 1;
  const isOutOfRecipes = currentIndex >= allRecipes.length;
  const currentRecipe = allRecipes.at(currentIndex);

  function handleNext() {
    setCurrentIndex((prev) => prev + 1);
  }

  function handleLike(recipe: Recipe) {
    setLikedRecipes((prev) => [...prev, recipe]);
    handleNext();
  }

  function handleReset() {
    setLikedRecipes([]);
    setCurrentIndex(0);
    setState('filter');
  }

  useEffect(() => {
    if (!noRecipes && isOutOfRecipes) setState('tournament');

    if (allRecipes.length === 1) {
      setState('tournament');
      setLikedRecipes(allRecipes);
    }
  }, [isOutOfRecipes, noRecipes, setState, setLikedRecipes, allRecipes]);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <h1 className="text-center text-2xl font-bold">Húzd jobbra, ha tetszik</h1>

      {showSkeleton && <RecipeCardSkeleton />}

      {!isLoading && noRecipes && (
        <NoContent
          action={<Button onClick={handleReset}>Vissza a hozzávalókhoz</Button>}
          className="py-12"
          description={
            'Úgy tűnik, nincs egyetlen recept sem, ami megfelelne a keresési feltételeidnek. Próbáld meg módosítani a keresési feltételeidet.'
          }
          title={'Nincsenek receptek'}
        />
      )}

      {allRecipes.length > 1 && currentRecipe && (
        <AnimatedCard
          key={currentIndex}
          onDislike={() => handleNext()}
          onLike={handleLike}
          recipe={currentRecipe}
        />
      )}
    </div>
  );
}

function AnimatedCard({ onDislike, onLike, recipe }: AnimatedCardProps) {
  const x = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.95);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  useEffect(() => {
    animate(opacity, 1, { duration: 0.2, ease: 'easeOut' });
    animate(scale, 1, { duration: 0.2, ease: 'easeOut' });
  }, [opacity, scale]);

  async function swipe(direction: 'left' | 'right') {
    const target = direction === 'right' ? 700 : -700;

    await Promise.all([
      animate(x, target, { duration: 0.35, ease: 'easeIn' }),
      animate(opacity, 0, { duration: 0.25, ease: 'easeIn' }),
    ]);

    if (direction === 'right') onLike(recipe);
    else onDislike();
  }

  async function handleDragEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) {
      await swipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
      await swipe('left');
    } else {
      animate(x, 0, { damping: 25, stiffness: 300, type: 'spring' });
    }
  }

  return (
    <motion.div
      className="relative cursor-grab select-none active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      style={{ opacity, rotate, scale, x }}
    >
      <RecipeCard
        onDislike={() => swipe('left')}
        onLike={() => swipe('right')}
        pageType="tinder"
        recipe={recipe}
      />
    </motion.div>
  );
}
