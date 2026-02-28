'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChefHat, Clock, Plus, Trash2, Upload, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormInput, FormSelect, FormTextarea } from '~/components/form';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { FieldError } from '~/components/ui/field';
import { SelectGroup, SelectItem, SelectLabel } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { useIsMobile } from '~/hooks/use-mobile';
import { GET, POST, PUT } from '~/lib/api';
import { cn } from '~/lib/utils';
import {
  categoriesSchema,
  type CreateUpdateRecipeSchema,
  ingredientsSchema,
  isIntegerString,
  isPositiveIntegerString,
  unitsSchema,
} from '~/lib/zod';

const formSchema = z.object({
  categories: z.array(z.number().int().positive()).min(1, {
    error: 'Válassz legalább egy kategóriát!',
  }),
  cookTimeMinutes: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'A főzési/sütési idő csak pozitív egész szám lehet!' }),
  description: z.string().trim().min(1, { error: 'Add meg a recept leírását!' }),
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
  instructions: z.string().trim().min(1, { error: 'Add meg az elkészítési utasításokat!' }),
  prepTimeMinutes: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'Az előkészítési idő csak pozitív egész szám lehet!' }),
  previewImageUrl: z
    .url({ error: 'Adj meg egy érvényes URL-t!' })
    .trim()
    .max(2048, {
      error: 'Az URL hossza legfeljebb 2048 karakter lehet!',
    })
    .refine((url) => url.startsWith('https://'), {
      error: 'Az URL-nek https:// előtaggal kell kezdődnie!',
    }),
  servings: z
    .string()
    .trim()
    .refine(isIntegerString, { error: 'Az adagok száma csak pozitív egész szám lehet!' }),
  title: z
    .string()
    .trim()
    .min(1, { error: 'Add meg a recept nevét!' })
    .max(512, { error: 'A recept neve legfeljebb 512 karakter lehet!' }),
});

type FormSchema = z.infer<typeof formSchema>;

type RecipeFormProps = {
  defaultValues: FormSchema;
  recipeId?: number;
};

export function RecipeForm({ defaultValues, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const isEdit = !!recipeId;

  const { control, handleSubmit, reset } = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    append: appendIngredient,
    fields: addedIngredients,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryFn: () => GET('/api/categories', categoriesSchema),
    queryKey: ['categories'],
  });

  const { data: ingredients, isLoading: isIngredientsLoading } = useQuery({
    queryFn: () => GET('/api/ingredients', ingredientsSchema),
    queryKey: ['ingredients'],
  });

  const { data: units, isLoading: isUnitsLoading } = useQuery({
    queryFn: () => GET('/api/units', unitsSchema),
    queryKey: ['units'],
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
      cookTimeMinutes: Number(data.cookTimeMinutes),
      ingredients: data.ingredients.map((ingredient) => ({
        ingredientId: Number(ingredient.ingredientId),
        quantity: Number(ingredient.quantity),
        unitId: Number(ingredient.unitId),
      })),
      prepTimeMinutes: Number(data.prepTimeMinutes),
      servings: Number(data.servings),
    } satisfies CreateUpdateRecipeSchema;

    toast.promise(isEdit ? updateRecipe(parsedData) : createRecipe(parsedData), {
      error: `Hiba történt a recept ${isEdit ? 'szerkesztése' : 'létrehozása'} során!`,
      loading: `Recept ${isEdit ? 'szerkesztése' : 'létrehozása'}...`,
      success: `A recept sikeresen ${isEdit ? 'szerkesztve' : 'létrehozva'}!`,
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
              control={control}
              label="Recept neve"
              name="title"
              placeholder="Add meg a recept nevét..."
            />

            <FormTextarea
              className="min-h-25 resize-none"
              control={control}
              label="Leírás"
              name="description"
              placeholder="Recept rövid leírása..."
            />

            <div className="flex items-end gap-2">
              <FormInput
                control={control}
                label="Előnézeti kép URL"
                name="previewImageUrl"
                placeholder="https://example.com/image.jpg"
              />

              <Button
                onClick={() => toast.error('TODO image upload')}
                size="icon"
                type="button"
                variant="outline"
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
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                label={
                  <>
                    <Clock className="size-4" />
                    <span>Előkészítési idő (perc)</span>
                  </>
                }
                min={0}
                name="prepTimeMinutes"
                placeholder="15"
                step={1}
                type="number"
              />

              <FormInput
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                label={
                  <>
                    <ChefHat className="size-4" />
                    <span>Főzési/Sütési idő (perc)</span>
                  </>
                }
                min={0}
                name="cookTimeMinutes"
                placeholder="30"
                step={1}
                type="number"
              />

              <FormInput
                control={control}
                errorPosition={isMobile ? 'top' : 'bottom'}
                label={
                  <>
                    <Users className="size-4" />
                    <span>Adagok száma</span>
                  </>
                }
                min={0}
                name="servings"
                placeholder="4"
                step={1}
                type="number"
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
                            className={cn(
                              'h-8 w-16 rounded-full',
                              index % 2 === 0 && 'w-24',
                              index % 3 === 0 && 'w-18',
                            )}
                            key={index}
                          />
                        ))}

                    {categories?.map((category) => {
                      const isSelected = field.value.includes(category.id);

                      return (
                        <Badge
                          className={cn(
                            'flex cursor-pointer gap-2 px-3 py-1.5 text-sm transition-colors select-none',
                            fieldState.invalid && 'border-destructive',
                          )}
                          key={category.id}
                          onClick={() => {
                            const nextValue = isSelected
                              ? field.value.filter((id) => id !== category.id)
                              : [...field.value, category.id];

                            field.onChange(nextValue);
                          }}
                          variant={isSelected ? 'default' : 'outline'}
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
              onClick={() => appendIngredient({ ingredientId: '', quantity: '', unitId: '' })}
              size={isMobile ? 'icon-sm' : 'sm'}
              type="button"
              variant="outline"
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
                  className="bg-background/30 flex items-start gap-4 rounded-lg border p-6"
                  key={field.id}
                >
                  <div className="flex w-full flex-col gap-3">
                    <FormSelect
                      control={control}
                      disabled={isIngredientsLoading}
                      label="Hozzávaló neve"
                      name={`ingredients.${index}.ingredientId`}
                      placeholder="Válassz hozzávalót"
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
                      control={control}
                      label="Mennyiség"
                      min={0}
                      name={`ingredients.${index}.quantity`}
                      placeholder="250"
                      step={1}
                      type="number"
                    />

                    <FormSelect
                      control={control}
                      disabled={isUnitsLoading}
                      label="Mértékegység"
                      name={`ingredients.${index}.unitId`}
                      placeholder="Válassz mértékegységet"
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
                    className="self-end"
                    disabled={addedIngredients.length === 1}
                    onClick={() => removeIngredient(index)}
                    size="icon"
                    type="button"
                    variant="destructive"
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
              className="min-h-50 resize-none"
              control={control}
              label="Elkészítési utasítások"
              name="instructions"
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
