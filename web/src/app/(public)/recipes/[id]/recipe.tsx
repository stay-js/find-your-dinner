'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Clock, Users, ChefHat, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { Checkbox } from '~/components/ui/checkbox';
import { recipeSchema } from '~/lib/zod-schemas';
import { GET } from '~/lib/api-utils';

export function Recipe({ recipeId }: { recipeId: string }) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => GET(`/api/recipes/latest/${recipeId}`, recipeSchema),
  });

  const toggleIngredient = (ingredientId: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Skeleton className="h-96 w-full" />
            <div className="flex flex-col gap-4 pt-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const { recipeData, categories, ingredients } = recipe;
  const totalTime = recipeData.prepTimeMinutes + recipeData.cookTimeMinutes;

  return (
    <div className="container max-w-7xl py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={recipeData.previewImageUrl}
              alt={recipeData.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
              {recipeData.verified && (
                <Badge className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Ellenőrzött
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{recipeData.title}</h1>

            <p className="text-muted-foreground text-lg">{recipeData.description}</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-5 w-5" />
                <div className="text-sm">
                  <div className="font-medium">Előkészítés: {recipeData.prepTimeMinutes} perc</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="text-muted-foreground h-5 w-5" />
                <div className="text-sm">
                  <div className="font-medium">Főzés: {recipeData.cookTimeMinutes} perc</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground h-5 w-5" />
                <div className="text-sm">
                  <div className="font-medium">{recipeData.servings} adag</div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Elkészítés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{recipeData.instructions}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gyors áttekintés</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Összes idő</span>
                <span className="font-medium">{totalTime} perc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adagok</span>
                <span className="font-medium">{recipeData.servings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Létrehozva</span>
                <span className="font-medium">
                  {new Date(recipeData.createdAt).toLocaleDateString('hu-HU')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Hozzávalók</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {ingredients.map((item) => (
                    <div key={item.ingredient.id} className="flex items-start gap-3">
                      <Checkbox
                        id={`ingredient-${item.ingredient.id}`}
                        checked={checkedIngredients.has(item.ingredient.id)}
                        onCheckedChange={() => toggleIngredient(item.ingredient.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`ingredient-${item.ingredient.id}`}
                        className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                          checkedIngredients.has(item.ingredient.id)
                            ? 'text-muted-foreground line-through'
                            : ''
                        }`}
                      >
                        <span className="font-medium">
                          {item.quantity} {item.unit.abbreviation}
                        </span>{' '}
                        {item.ingredient.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
