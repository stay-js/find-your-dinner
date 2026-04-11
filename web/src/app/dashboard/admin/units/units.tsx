'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { NoContent } from '~/components/no-content';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useSearch } from '~/hooks/filter/use-search';
import { DELETE, GET, POST, PUT } from '~/lib/api';
import { type CreateUpdateUnitSchema, unitsSchema, type Unit as UnitType } from '~/lib/zod';

import { Unit, UnitSkeleton } from './unit';
import { UnitForm } from './unit-form';

export function Units() {
  const queryClient = useQueryClient();
  const { debouncedQuery, handleQueryChange, query } = useSearch(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selected, setSelected] = useState<null | UnitType>(null);

  const { data: units, isLoading } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('query', debouncedQuery);

      return GET(`/api/units?${params}`, unitsSchema);
    },
    queryKey: ['units', { query: debouncedQuery }],
  });

  const { isPending: isStorePending, mutate: store } = useMutation({
    mutationFn: (data: CreateUpdateUnitSchema) => POST('/api/units', data),
    onError: () => {
      toast.error('Hiba történt a mértékegység létrehozása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isUpdatePending, mutate: update } = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & CreateUpdateUnitSchema) => {
      return PUT(`/api/units/${id}`, data);
    },
    onError: () => {
      toast.error('Hiba történt a mértékegység módosítása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setIsSheetOpen(false);
    },
  });

  const { isPending: isDestroyPending, mutate: destroy } = useMutation({
    mutationFn: (id: number) => DELETE(`/api/units/${id}`),
    onError: () => {
      toast.error('Hiba történt a mértékegység törlése során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
  });

  function openCreate() {
    setSelected(null);
    setIsSheetOpen(true);
  }

  function openEdit(unit: UnitType) {
    setSelected(unit);
    setIsSheetOpen(true);
  }

  const hasQuery = debouncedQuery.length > 0;
  const isEditing = selected !== null;

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
          <h1 className="text-foreground text-2xl font-semibold">Mértékegységek kezelése</h1>

          <Button onClick={openCreate} type="button">
            <Plus className="size-4" />
            <span>Új mértékegység</span>
          </Button>
        </div>

        <Input onChange={handleQueryChange} placeholder="Keresés..." value={query} />

        {!isLoading && units?.length === 0 && (
          <NoContent
            action={
              hasQuery ? undefined : (
                <Button onClick={openCreate} size="sm" type="button">
                  Mértékegység létrehozása
                </Button>
              )
            }
            description={
              hasQuery
                ? 'Sajnos nincs a keresési feltételeknek megfelelő mértékegység. Próbáld meg módosítani a keresési feltételeket.'
                : 'Úgy tűnik még nincsenek mértékegységek. Az alábbi gombra kattintva megteheted.'
            }
            title={hasQuery ? 'Nincs találat' : 'Nincs megjeleníthető mértékegység'}
          />
        )}

        <div className="flex flex-col gap-2">
          {isLoading && new Array(3).fill(null).map((_, i) => <UnitSkeleton key={i} />)}

          {units?.map((unit) => (
            <Unit
              isDestroyPending={isDestroyPending}
              key={unit.id}
              onDelete={() => destroy(unit.id)}
              onEdit={() => openEdit(unit)}
              unit={unit}
            />
          ))}
        </div>
      </div>

      <UnitForm
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
