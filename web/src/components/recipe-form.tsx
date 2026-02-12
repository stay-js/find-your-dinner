'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, Users, Plus, Trash2, Upload, ChefHat, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { SelectGroup, SelectItem, SelectLabel } from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { FieldError } from '~/components/ui/field';
import { Skeleton } from '~/components/ui/skeleton';
import { FormInput, FormTextarea, FormSelect } from '~/components/form';
import {
  categoriesSchema,
  ingredientsSchema,
  unitsSchema,
  type CreateUpdateRecipeSchema,
} from '~/lib/zod-schemas';
import { isIntegerString, isPositiveIntegerString } from '~/lib/zod-helpers';
import { GET, POST, PUT } from '~/lib/api-utils';
import { useIsMobile } from '~/hooks/use-mobile';
import { cn } from '~/lib/utils';

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'Add meg a recept nevét!' })
    .max(512, { error: 'A recept neve legfeljebb 512 karakter lehet!' }),
  previewImageUrl: z.url({ error: 'Adj meg egy érvényes URL-t!' }).trim().max(2048, {
    error: 'Az URL hossza legfeljebb 2048 karakter lehet!',
  }),
  description: z.string().trim().min(1, { error: 'Add meg a recept leírását!' }),
  instructions: z.string().trim().min(1, { error: 'Add meg az elkészítési utasításokat!' }),
  prepTimeMinutes: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'Az előkészítési idő csak pozitív egész szám lehet!' }),
  cookTimeMinutes: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'A főzési/sütési idő csak pozitív egész szám lehet!' }),
  servings: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'Az adagok száma csak pozitív egész szám lehet!' }),
  categories: z.array(z.number().int().positive()).min(1, {
    error: 'Válassz legalább egy kategóriát!',
  }),
  ingredients: z
    .array(
      z.object({
        ingredientId: z
          .string()
          .trim()
          .refine(isPositiveIntegerString, { error: 'Válassz hozzávalót!' }),
        quantity: z
          .string()
          .trim()
          .refine(isPositiveIntegerString, { error: 'A mennyiség csak pozitív egész szám lehet!' }),
        unitId: z
          .string()
          .trim()
          .refine(isPositiveIntegerString, { error: 'Válassz mértékegységet!' }),
      }),
    )
    .min(1, { error: 'Adj hozzá legalább egy hozzávalót!' }),
});

type FormSchema = z.infer<typeof formSchema>;

export function RecipeForm({
  defaultValues,
  recipeId,
}: {
  defaultValues: FormSchema;
  recipeId?: number;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const isEdit = !!recipeId;

  const { handleSubmit, control, reset } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    fields: addedIngredients,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => GET('/api/categories', categoriesSchema),
  });

  const { data: ingredients, isLoading: isIngredientsLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => GET('/api/ingredients', ingredientsSchema),
  });

  const { data: units, isLoading: isUnitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: () => GET('/api/units', unitsSchema),
  });

  const { mutateAsync: createRecipe } = useMutation({
    mutationFn: (data: CreateUpdateRecipeSchema) => POST('/api/recipes', data),
    onSuccess: () => router.push('/dashboard/recipes/manage'),
  });

  const { mutateAsync: updateRecipe } = useMutation({
    mutationFn: (data: CreateUpdateRecipeSchema) => PUT(`/api/recipes/${recipeId}`, data),
    onSuccess: () => router.push('/dashboard/recipes/manage'),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    reset(defaultValues);

    const parsedData = {
      ...data,
      prepTimeMinutes: Number(data.prepTimeMinutes),
      cookTimeMinutes: Number(data.cookTimeMinutes),
      servings: Number(data.servings),
      ingredients: data.ingredients.map((ingredient) => ({
        ingredientId: Number(ingredient.ingredientId),
        quantity: Number(ingredient.quantity),
        unitId: Number(ingredient.unitId),
      })),
    } satisfies CreateUpdateRecipeSchema;

    toast.promise(isEdit ? updateRecipe(parsedData) : createRecipe(parsedData), {
      loading: `Recept ${isEdit ? 'szerkesztése' : 'létrehozása'}...`,
      success: `A recept sikeresen ${isEdit ? 'szerkesztve' : 'létrehozva'}!`,
      error: `Hiba történt a recept ${isEdit ? 'szerkesztése' : 'létrehozása'} során!`,
    });
  };

  return (
    <div className="container flex max-w-4xl flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground rounded-lg p-2">
          <ChefHat className="size-6" />
        </div>

        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Recept {isEdit ? 'szerkesztése' : 'létrehozása'}
          </h1>
          <p className="text-muted-foreground text-sm">
            Töltsd ki az alábbi űrlapot{' '}
            {isEdit ? 'a recept szerkesztéséhez' : 'egy új recept létrehozásához'}.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alapvető információk</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormInput
              name="title"
              control={control}
              label="Recept neve"
              placeholder="Add meg a recept nevét..."
            />

            <FormTextarea
              name="description"
              control={control}
              className="min-h-25 resize-none"
              label="Leírás"
              placeholder="Recept rövid leírása..."
            />

            <div className="flex items-end gap-2">
              <FormInput
                name="previewImageUrl"
                control={control}
                label="Előnézeti kép URL"
                placeholder="https://example.com/image.jpg"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toast.error('TODO image upload')}
              >
                <Upload className="size-4" />
                <span className="sr-only">Kép feltöltése</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elkészítési idő és adagok</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <FormInput
                name="prepTimeMinutes"
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                type="number"
                min={0}
                step={1}
                label={
                  <>
                    <Clock className="size-4" />
                    <span>Előkészítési idő (perc)</span>
                  </>
                }
                placeholder="15"
              />

              <FormInput
                name="cookTimeMinutes"
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                type="number"
                min={0}
                step={1}
                label={
                  <>
                    <ChefHat className="size-4" />
                    <span>Főzési/Sütési idő (perc)</span>
                  </>
                }
                placeholder="30"
              />

              <FormInput
                name="servings"
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                type="number"
                min={0}
                step={1}
                label={
                  <>
                    <Users className="size-4" />
                    <span>Adagok száma</span>
                  </>
                }
                placeholder="4"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kategóriák</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Válaszd ki a receptedhez tartozó kategóriákat:
            </p>

            <Controller
              control={control}
              name="categories"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {isCategoriesLoading &&
                      new Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            className={cn(
                              'h-8 w-16 rounded-full',
                              index % 2 === 0 && 'w-24',
                              index % 3 === 0 && 'w-18',
                            )}
                          />
                        ))}

                    {categories?.map((category) => {
                      const isSelected = field.value.includes(category.id);

                      return (
                        <Badge
                          key={category.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={cn(
                            'flex cursor-pointer gap-2 px-3 py-1.5 text-sm transition-colors select-none',
                            fieldState.invalid && 'border-destructive',
                          )}
                          onClick={() => {
                            const nextValue = isSelected
                              ? field.value.filter((id) => id !== category.id)
                              : [...field.value, category.id];

                            field.onChange(nextValue);
                          }}
                        >
                          {isSelected && <X className="size-4" />}
                          <span>{category.name}</span>
                        </Badge>
                      );
                    })}
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Hozzávalók</CardTitle>

            <Button
              type="button"
              variant="outline"
              size={isMobile ? 'icon-sm' : 'sm'}
              onClick={() => appendIngredient({ ingredientId: '', quantity: '', unitId: '' })}
            >
              <Plus className="size-4" />
              <span className="max-md:hidden">Hozzávaló hozzáadása</span>
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {addedIngredients.map((field, index) => (
              <Fragment key={field.id}>
                {index > 0 && <Separator />}

                <div
                  key={field.id}
                  className="bg-background/30 flex items-start gap-4 rounded-lg border p-6"
                >
                  <div className="flex w-full flex-col gap-3">
                    <FormSelect
                      control={control}
                      name={`ingredients.${index}.ingredientId`}
                      label="Hozzávaló neve"
                      placeholder="Válassz hozzávalót"
                      disabled={isIngredientsLoading}
                    >
                      <SelectGroup>
                        <SelectLabel>Hozzávalók</SelectLabel>

                        {ingredients?.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                            {ingredient.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </FormSelect>

                    <FormInput
                      name={`ingredients.${index}.quantity`}
                      control={control}
                      label="Mennyiség"
                      type="number"
                      min={0}
                      step={1}
                      placeholder="250"
                    />

                    <FormSelect
                      control={control}
                      name={`ingredients.${index}.unitId`}
                      label="Mértékegység"
                      placeholder="Válassz mértékegységet"
                      disabled={isUnitsLoading}
                    >
                      <SelectGroup>
                        <SelectLabel>Mértékegységek</SelectLabel>

                        {units?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id.toString()}>
                            {unit.abbreviation} ({unit.name})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </FormSelect>
                  </div>

                  <Button
                    type="button"
                    className="self-end"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={addedIngredients.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Fragment>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elkészítés</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormTextarea
              name="instructions"
              control={control}
              className="min-h-50 resize-none"
              label="Elkészítési utasítások"
              placeholder="Írd le lépésről lépésre, a recepted elkészítését..."
            />

            <p className="text-muted-foreground text-xs">
              Tipp: Használj számozott lépéseket a könnyebb érthetőség érdekében (pl. 1. Melegítsd
              elő a sütőt 180°C-ra)
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            <ChefHat className="size-4" />

            <span>Recept {isEdit ? 'szerkesztése' : 'létrehozása'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
