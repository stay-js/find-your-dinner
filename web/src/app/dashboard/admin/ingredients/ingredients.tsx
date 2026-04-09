'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { NoContent } from '~/components/no-content';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useSearch } from '~/hooks/filter/use-search';
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { DELETE, GET, POST, PUT } from '~/lib/api';
import {
  type CreateUpdateIngredientSchema,
  ingredientsSchema,
  type Ingredient as IngredientType,
} from '~/lib/zod';

import { Ingredient, IngredientSkeleton } from './ingredient';
import { IngredientForm } from './ingredient-form';

export function Ingredients() {
  const queryClient = useQueryClient();
  const { debouncedQuery, handleQueryChange, query } = useSearch(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selected, setSelected] = useState<IngredientType | null>(null);

  const { data: ingredients, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('query', debouncedQuery);

      return GET(`/api/ingredients?${params}`, ingredientsSchema);
    },
    queryKey: ['ingredients', { query: debouncedQuery }],
  });

  const showSkeleton = useDebouncedLoading(isLoading);

  const { isPending: isStorePending, mutate: store } = useMutation({
    mutationFn: (data: CreateUpdateIngredientSchema) => POST('/api/ingredients', data),
    onError: () => {
      toast.error('Hiba történt a hozzávaló létrehozása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isUpdatePending, mutate: update } = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & CreateUpdateIngredientSchema) => {
      return PUT(`/api/ingredients/${id}`, data);
    },
    onError: () => {
      toast.error('Hiba történt a hozzávaló módosítása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isDestroyPending, mutate: destroy } = useMutation({
    mutationFn: (id: number) => DELETE(`/api/ingredients/${id}`),
    onError: () => {
      toast.error('Hiba történt a hozzávaló törlése során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  function openCreate() {
    setSelected(null);
    setIsSheetOpen(true);
  }

  function openEdit(ingredient: IngredientType) {
    setSelected(ingredient);
    setIsSheetOpen(true);
  }

  const hasQuery = debouncedQuery.length > 0;
  const isEditing = selected !== null;

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <h1 className="text-foreground text-2xl font-semibold">Hozzávalók kezelése</h1>

          <Button onClick={openCreate} type="button">
            <Plus className="size-4" />
            <span>Új hozzávaló</span>
          </Button>
        </div>

        <Input onChange={handleQueryChange} placeholder="Keresés..." value={query} />

        {!isLoading && ingredients?.length === 0 && (
          <NoContent
            action={
              hasQuery ? undefined : (
                <Button onClick={openCreate} size="sm" type="button">
                  Hozzávaló létrehozása
                </Button>
              )
            }
            description={
              hasQuery
                ? 'Sajnos nincs a keresési feltételeknek megfelelő hozzávaló. Próbáld meg módosítani a keresési feltételeket.'
                : 'Úgy tűnik még nincsenek hozzávalók. Az alábbi gombra kattintva megteheted.'
            }
            title={hasQuery ? 'Nincs találat' : 'Nincs megjeleníthető hozzávaló'}
          />
        )}

        <div className="flex flex-col gap-2">
          {showSkeleton && new Array(3).fill(null).map((_, i) => <IngredientSkeleton key={i} />)}

          {!showSkeleton &&
            ingredients?.map((ingredient) => (
              <Ingredient
                ingredient={ingredient}
                isDestroyPending={isDestroyPending}
                key={ingredient.id}
                onDelete={() => destroy(ingredient.id)}
                onEdit={() => openEdit(ingredient)}
              />
            ))}
        </div>
      </div>

      <IngredientForm
        isEditing={isEditing}
        isOpen={isSheetOpen}
        isPending={isEditing ? isUpdatePending : isStorePending}
        onSubmit={(values) => (isEditing ? update({ id: selected.id, ...values }) : store(values))}
        selected={selected}
        setIsOpen={setIsSheetOpen}
        setSelected={setSelected}
      />
    </>
  );
}
