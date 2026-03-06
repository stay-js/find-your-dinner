'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';
import { type IngredientsWithPivot, type IngredientWithPivot } from '~/lib/zod';

type IngredientProps = {
  checked: boolean;
  item: IngredientWithPivot;
  mulitplier: number;
  toggleIngredient: (id: number) => void;
};

type IngredientsProps = {
  className?: string;
  ingredients: IngredientsWithPivot;
  servings: number;
};

export function Ingredients({ className, ingredients, servings }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [cookedServings, setCookedServings] = useState(servings);

  const multiplier = cookedServings / servings;

  const toggleIngredient = (ingredientId: number) => {
    setCheckedIngredients((prev) => {
      const newCheckedIngredients = new Set(prev);

      if (newCheckedIngredients.has(ingredientId)) {
        newCheckedIngredients.delete(ingredientId);
      } else {
        newCheckedIngredients.add(ingredientId);
      }

      return newCheckedIngredients;
    });
  };

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>Hozzávalók</span>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCookedServings((val) => Math.max(1, val - 1))}
              size="icon-sm"
              variant="outline"
            >
              <Minus className="size-3.5" />
            </Button>

            <span className="text-sm">{cookedServings} adag</span>

            <Button
              onClick={() => setCookedServings((val) => val + 1)}
              size="icon-sm"
              variant="outline"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {ingredients.map((item) => (
          <Ingredient
            checked={checkedIngredients.has(item.ingredient.id)}
            item={item}
            key={item.ingredient.id}
            mulitplier={multiplier}
            toggleIngredient={toggleIngredient}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function Ingredient({ checked, item, mulitplier, toggleIngredient }: IngredientProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3" key={item.ingredient.id}>
      <Checkbox
        checked={checked}
        id={id}
        onCheckedChange={() => toggleIngredient(item.ingredient.id)}
      />

      <label
        className={cn(
          'cursor-pointer text-sm select-none',
          checked && 'text-muted-foreground line-through',
        )}
        htmlFor={id}
      >
        <span className="font-medium">
          {item.quantity * mulitplier} {item.unit.abbreviation}
        </span>{' '}
        <span>{item.ingredient.name}</span>
      </label>
    </div>
  );
}
