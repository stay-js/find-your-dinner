'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChefHat, Clock, Plus, Trash2, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { DeletePopover } from '~/components/delete-popover';
import { FormCombobox, FormInput, FormSelect, FormTextarea } from '~/components/form';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { FieldError } from '~/components/ui/field';
import { SelectGroup, SelectItem, SelectLabel } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { Toggle } from '~/components/ui/toggle';
import { useIsMobile } from '~/hooks/use-mobile';
import { useMounted } from '~/hooks/use-mounted';
import { DELETE, POST, PUT } from '~/lib/api';
import { getCategories, getIngredients, getUnits } from '~/lib/queries';
import { cn } from '~/lib/utils';
import {
  type CreateUpdateRecipeSchema,
  isNonNegativeIntegerString,
  isPositiveIntegerString,
} from '~/lib/zod';

const formSchema = z.object({
  categories: z.array(z.number().int().positive()).min(1, {
    error: 'Válassz legalább egy kategóriát!',
  }),
  cookTimeMinutes: z.string().trim().refine(isNonNegativeIntegerString, {
    error: 'A főzési/sütési idő csak természetes szám lehet!',
  }),
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
  prepTimeMinutes: z.string().trim().refine(isNonNegativeIntegerString, {
    error: 'Az előkészítési idő csak természetes szám lehet!',
  }),
  previewImageUrl: z
    .url({ error: 'Adj meg egy érvényes URL-t!' })
    .trim()
    .max(2048, {
      error: 'Az URL hossza legfeljebb 2048 karakter lehet!',
    })
    .refine((url) => url.startsWith('https://'), {
      error: 'Az URL-nek https:// előtaggal kell kezdődnie!',
    }),
  servings: z.string().trim().refine(isPositiveIntegerString, {
    error: 'Az adagok száma csak pozitív egész szám lehet!',
  }),
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
  const mounted = useMounted();
  const utils = useQueryClient();

  const isEdit = !!recipeId;

  function invalidate() {
    utils.invalidateQueries({ queryKey: ['recipes'] });
    utils.invalidateQueries({ queryKey: ['currentUser', 'recipes'] });

    utils.invalidateQueries({ queryKey: ['categories'] });
    utils.invalidateQueries({ queryKey: ['ingredients'] });
    utils.invalidateQueries({ queryKey: ['units'] });
  }

  const { control, handleSubmit, reset } = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    append: appendIngredient,
    fields: addedIngredients,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery(getCategories());
  const { data: ingredients } = useQuery(getIngredients());
  const { data: units } = useQuery(getUnits());

  const ingredientOptions = useMemo(
    () => ingredients?.map(({ id, name }) => ({ label: name, value: id })) ?? [],
    [ingredients],
  );

  const { isPending: isCreatePending, mutateAsync: createRecipe } = useMutation({
    mutationFn: (data: CreateUpdateRecipeSchema) => POST('/api/recipes', data),
    onError: () => toast.error('Hiba történt a recept létrehozása során!'),
    onSuccess: () => {
      invalidate();
      router.push('/dashboard/recipes');
    },
  });

  const { isPending: isUpdatePending, mutateAsync: updateRecipe } = useMutation({
    mutationFn: (data: CreateUpdateRecipeSchema) => PUT(`/api/recipes/${recipeId}`, data),
    onError: () => toast.error('Hiba történt a recept szerkesztése során!'),
    onSuccess: () => {
      invalidate();
      router.push('/dashboard/recipes');
    },
  });

  const { isPending: isDeletePending, mutate: deleteRecipe } = useMutation({
    mutationFn: () => DELETE(`/api/recipes/${recipeId}`),
    onError: () => toast.error('Hiba történt a recept törlése során!'),
    onSuccess: () => {
      invalidate();
      router.push('/dashboard/recipes');
    },
  });

  const isPending = isCreatePending || isUpdatePending;

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
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

    if (isEdit) {
      updateRecipe(parsedData);
    } else {
      createRecipe(parsedData);
    }

    reset(defaultValues);
  };

  return (
    <div className="@container container flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-2xl font-semibold">
            Recept {isEdit ? 'szerkesztése' : 'létrehozása'}
          </h1>
          <p className="text-muted-foreground text-sm">
            Töltsd ki az alábbi űrlapot{' '}
            {isEdit ? 'a recept szerkesztéséhez' : 'egy új recept létrehozásához'}.
          </p>
        </div>

        {isEdit && (
          <DeletePopover
            isPending={isDeletePending}
            onDelete={deleteRecipe}
            showText
            size="sm"
            type="Recept"
          />
        )}
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

            <FormInput
              control={control}
              label="Előnézeti kép URL"
              name="previewImageUrl"
              placeholder="https://example.com/image.jpg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elkészítési idő és adagok</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <FormInput
                control={control}
                icon={<Clock className="size-4" />}
                label="Előkészítési idő (perc)"
                min={0}
                name="prepTimeMinutes"
                placeholder="15"
                step={1}
                type="number"
              />

              <FormInput
                control={control}
                icon={<ChefHat className="size-4" />}
                label="Főzési/Sütési idő (perc)"
                min={0}
                name="cookTimeMinutes"
                placeholder="30"
                step={1}
                type="number"
              />

              <FormInput
                control={control}
                icon={<Users className="size-4" />}
                label="Adagok száma"
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
            <p className="text-muted-foreground text-sm">
              Válaszd ki a receptedhez tartozó kategóriákat:
            </p>
          </CardHeader>

          <CardContent>
            <Controller
              control={control}
              name="categories"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {isCategoriesLoading &&
                      new Array(8)
                        .fill(null)
                        .map((_, index) => (
                          <Skeleton
                            className={cn('h-8 rounded-lg', ['w-16', 'w-24', 'w-18'][index % 3])}
                            key={index}
                          />
                        ))}

                    {categories?.map((category) => {
                      const isSelected = field.value.includes(category.id);

                      return (
                        <Toggle
                          aria-invalid={fieldState.invalid}
                          key={category.id}
                          onPressedChange={(pressed) => {
                            const nextValue = pressed
                              ? [...field.value, category.id]
                              : field.value.filter((id) => id !== category.id);

                            field.onChange(nextValue);
                          }}
                          pressed={isSelected}
                          variant="outline"
                        >
                          <span>{category.name}</span>

                          {isSelected && <X className="size-3.5" />}
                        </Toggle>
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
              <span className="max-md:sr-only">Hozzávaló hozzáadása</span>
            </Button>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6 @4xl:grid-cols-2">
            {addedIngredients.map((field, index) => (
              <div
                className="bg-background/30 flex flex-col gap-4 rounded-lg border p-6"
                key={field.id}
              >
                <div className="flex h-7 items-center justify-between">
                  <p className="text-base font-semibold">{index + 1}. hozzávaló</p>

                  {addedIngredients.length > 1 && (
                    <Button
                      className="self-end"
                      onClick={() => removeIngredient(index)}
                      size="icon-sm"
                      type="button"
                      variant="destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>

                <div className="flex w-full flex-col gap-3">
                  <FormCombobox
                    control={control}
                    disabled={mounted && !ingredients}
                    label="Hozzávaló"
                    name={`ingredients.${index}.ingredientId`}
                    options={ingredientOptions}
                    placeholder="Válassz hozzávalót"
                  />

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
                    disabled={mounted && !units}
                    label="Mértékegység"
                    name={`ingredients.${index}.unitId`}
                    placeholder="Válassz mértékegységet"
                  >
                    <SelectGroup>
                      <SelectLabel>Mértékegységek</SelectLabel>

                      {units?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.name} ({unit.abbreviation})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </FormSelect>
                </div>
              </div>
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

        <Button className="self-end" disabled={isPending} size="lg" type="submit">
          {isPending && <Spinner />}
          <span>Mentés</span>
        </Button>
      </form>
    </div>
  );
}
