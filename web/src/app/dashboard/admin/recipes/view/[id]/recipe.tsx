'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, Users, ChefHat, AlertTriangle, CheckCircle, Pencil } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { useSidebar } from '~/components/ui/sidebar';
import { Skeleton } from '~/components/ui/skeleton';
import { recipeSchema } from '~/lib/zod-schemas';
import { GET, POST } from '~/lib/api-utils';
import { cn } from '~/lib/utils';

export function Recipe({ recipeId }: { recipeId: string }) {
  const utils = useQueryClient();

  const { open: isSidebarOpen } = useSidebar();

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => GET(`/api/recipes/latest/${recipeId}`, recipeSchema),
  });

  const { mutate: approveRecipeData, isPending: isApproving } = useMutation({
    mutationFn: (recipeDataId: number) => POST(`/api/admin/recipe-data/approve/${recipeDataId}`),
    onError: () => {
      toast.error('Hiba történt a recept jóváhagyása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => utils.invalidateQueries({ queryKey: ['recipe', recipeId] }),
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
          <div className="flex flex-col gap-6">
            <Skeleton className="h-96 w-full" />

            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
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
        {!recipeData.verified && (
          <div className="bg-accent/30 flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-accent-foreground size-5" />

              <div className="text-sm">
                <p className="font-medium">Ez a recept még nincs jóváhagyva</p>
                <p className="text-muted-foreground">
                  Amíg nem kerül jóváhagyásra, nem jelenik meg a nyilvános felületeken.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={isApproving}
              onClick={() => approveRecipeData(recipeData.id)}
            >
              <CheckCircle className="size-4" />
              <span>Recept jóváhagyása</span>
            </Button>
          </div>
        )}

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
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{recipeData.title}</h1>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/admin/recipes/edit/${recipeId}`}>
                <Pencil className="size-4" />
                <span>Szerkesztés</span>
              </Link>
            </Button>
          </div>

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

            <div className="text-sm font-medium">
              Főzés/Sütés: {recipeData.cookTimeMinutes} perc
            </div>
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
                  'cursor-pointer text-sm select-none',
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
