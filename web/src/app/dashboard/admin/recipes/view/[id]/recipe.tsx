'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Users, ChefHat } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { Checkbox } from '~/components/ui/checkbox';
import { useSidebar } from '~/components/ui/sidebar';
import { recipeSchema } from '~/lib/zod-schemas';
import { GET } from '~/lib/api-utils';
import { cn } from '~/lib/utils';

export function Recipe({ recipeId }: { recipeId: string }) {
  const { open: isSidebarOpen } = useSidebar();

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => GET(`/api/recipes/latest/${recipeId}`, recipeSchema),
  });

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

  if (isLoading) {
    return (
      <div className="container">
        <div
          className={cn(
            'grid gap-8',
            isSidebarOpen ? 'xl:grid-cols-[3fr_1fr]' : 'lg:grid-cols-[3fr_1fr]',
          )}
        >
          <div>
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

  if (!recipe) notFound();

  const { recipeData, categories, ingredients } = recipe;

  return (
    <div
      className={cn(
        'container grid gap-8',
        isSidebarOpen ? 'xl:grid-cols-[3fr_1fr]' : 'lg:grid-cols-[3fr_1fr]',
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={recipeData.previewImageUrl}
            alt={recipeData.title}
            className="size-full object-cover"
            width={1920}
            height={1080}
            priority
          />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight">{recipeData.title}</h1>
          <p className="text-muted-foreground text-lg">{recipeData.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground size-5" />

            <div className="text-sm font-medium">
              Előkészítés: {recipeData.prepTimeMinutes} perc
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ChefHat className="text-muted-foreground size-5" />

            <div className="text-sm font-medium">Főzés: {recipeData.cookTimeMinutes} perc</div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground size-5" />

            <div className="text-sm font-medium">{recipeData.servings} adag</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Elkészítés</CardTitle>
          </CardHeader>

          <CardContent className="whitespace-pre-wrap">{recipeData.instructions}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Áttekintés</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Elkészítési idő</span>
              <span className="font-medium">
                {recipeData.prepTimeMinutes + recipeData.cookTimeMinutes} perc
              </span>
            </div>

            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Létrehozás dátuma</span>
              <span className="font-medium">
                {new Date(recipeData.createdAt).toLocaleDateString('hu-HU')}
              </span>
            </div>

            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Utolsó módosítás dátuma</span>
              <span className="font-medium">
                {new Date(recipeData.updatedAt).toLocaleDateString('hu-HU')}
              </span>
            </div>

            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Készítő</span>
              <span className="font-medium">{recipe.recipe.userId}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="sticky top-20 h-fit">
        <CardHeader>
          <CardTitle>Hozzávalók</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {ingredients.map((item) => (
            <div key={item.ingredient.id} className="flex items-center gap-3">
              <Checkbox
                id={`ingredient-${item.ingredient.id}`}
                checked={checkedIngredients.has(item.ingredient.id)}
                onCheckedChange={() => toggleIngredient(item.ingredient.id)}
              />

              <label
                htmlFor={`ingredient-${item.ingredient.id}`}
                className={cn(
                  'cursor-pointer text-sm',
                  checkedIngredients.has(item.ingredient.id) &&
                    'text-muted-foreground line-through',
                )}
              >
                <span className="font-medium">
                  {item.quantity} {item.unit.abbreviation}
                </span>{' '}
                <span>{item.ingredient.name}</span>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
