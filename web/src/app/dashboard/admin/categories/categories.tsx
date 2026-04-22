'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Info } from '~/components/info';
import { NoContent } from '~/components/no-content';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useSearch } from '~/hooks/filter/use-search';
import { DELETE, GET, POST, PUT } from '~/lib/api';
import {
  categoriesSchema,
  type Category as CategoryType,
  type CreateUpdateCategorySchema,
} from '~/lib/zod';

import { Category, CategorySkeleton } from './category';
import { CategoryForm } from './category-form';

export function Categories() {
  const queryClient = useQueryClient();
  const { debouncedQuery, handleQueryChange, query } = useSearch(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selected, setSelected] = useState<CategoryType | null>(null);

  const { data: categories, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('query', debouncedQuery);

      return GET(`/api/categories?${params}`, categoriesSchema);
    },
    queryKey: ['categories', { query: debouncedQuery }],
  });

  const { isPending: isStorePending, mutate: store } = useMutation({
    mutationFn: (data: CreateUpdateCategorySchema) => POST('/api/categories', data),
    onError: () => {
      toast.error('Hiba történt a kategória létrehozása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isUpdatePending, mutate: update } = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & CreateUpdateCategorySchema) => {
      return PUT(`/api/categories/${id}`, data);
    },
    onError: () => {
      toast.error('Hiba történt a kategória módosítása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isDestroyPending, mutate: destroy } = useMutation({
    mutationFn: (id: number) => DELETE(`/api/categories/${id}`),
    onError: () => {
      toast.error('Hiba történt a kategória törlése során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  function openCreate() {
    setSelected(null);
    setIsSheetOpen(true);
  }

  function openEdit(category: CategoryType) {
    setSelected(category);
    setIsSheetOpen(true);
  }

  const hasQuery = debouncedQuery.length > 0;
  const isEditing = selected !== null;

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <h1 className="text-foreground text-2xl font-semibold">Kategóriák kezelése</h1>

          <Button onClick={openCreate} type="button">
            <Plus className="size-4" />
            <span>Új kategória</span>
          </Button>
        </div>

        <Input onChange={handleQueryChange} placeholder="Keresés..." value={query} />

        <Info>
          Csak azok a kategóriák törölhetőek, amelyek egy recepthez sincsenek hozzárendelve.
        </Info>

        {!isLoading && categories?.length === 0 && (
          <NoContent
            action={
              hasQuery ? undefined : (
                <Button onClick={openCreate} size="sm" type="button">
                  Kategória létrehozása
                </Button>
              )
            }
            description={
              hasQuery
                ? 'Sajnos nincs a keresési feltételeknek megfelelő kategória. Próbáld meg módosítani a keresési feltételeket.'
                : 'Úgy tűnik még nincsenek kategóriák. Az alábbi gombra kattintva megteheted.'
            }
            title={hasQuery ? 'Nincs találat' : 'Nincs megjeleníthető kategória'}
          />
        )}

        <div className="flex flex-col gap-2">
          {isLoading && new Array(3).fill(null).map((_, i) => <CategorySkeleton key={i} />)}

          {categories?.map((category) => (
            <Category
              category={category}
              isDestroyPending={isDestroyPending}
              key={category.id}
              onDelete={() => destroy(category.id)}
              onEdit={() => openEdit(category)}
            />
          ))}
        </div>
      </div>

      <CategoryForm
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
