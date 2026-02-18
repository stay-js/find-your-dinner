'use client';

import { useId, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';
import  { type IngredientsWithPivot, type IngredientWithPivot } from '~/lib/zod';

type IngredientProps = {
  checked: boolean;
  item: IngredientWithPivot;
  toggleIngredient: (id: number) => void;
};

type IngredientsProps = {
  className?: string;
  ingredients: IngredientsWithPivot;
};

export function Ingredients({ className, ingredients }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

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
        <CardTitle>Hozzávalók</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {ingredients.map((item) => (
          <Ingredient
            checked={checkedIngredients.has(item.ingredient.id)}
            item={item}
            key={item.ingredient.id}
            toggleIngredient={toggleIngredient}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function Ingredient({ checked, item, toggleIngredient }: IngredientProps) {
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
          {item.quantity} {item.unit.abbreviation}
        </span>{' '}
        <span>{item.ingredient.name}</span>
      </label>
    </div>
  );
}
