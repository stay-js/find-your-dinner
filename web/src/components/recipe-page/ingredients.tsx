'use client';

import { useId, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';

type Ingredient = {
  ingredient: {
    id: number;
    name: string;
  };
  quantity: number;
  unit: {
    id: number;
    name: string;
    abbreviation: string;
  };
};

function Ingredient({
  item,
  checked,
  toggleIngredient,
}: {
  item: Ingredient;
  checked: boolean;
  toggleIngredient: (id: number) => void;
}) {
  const id = useId();

  return (
    <div key={item.ingredient.id} className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={() => toggleIngredient(item.ingredient.id)}
      />

      <label
        htmlFor={id}
        className={cn(
          'cursor-pointer text-sm select-none',
          checked && 'text-muted-foreground line-through',
        )}
      >
        <span className="font-medium">
          {item.quantity} {item.unit.abbreviation}
        </span>{' '}
        <span>{item.ingredient.name}</span>
      </label>
    </div>
  );
}

export function Ingredients({
  className,
  ingredients,
}: {
  className?: string;
  ingredients: Ingredient[];
}) {
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
            key={item.ingredient.id}
            item={item}
            checked={checkedIngredients.has(item.ingredient.id)}
            toggleIngredient={toggleIngredient}
          />
        ))}
      </CardContent>
    </Card>
  );
}
