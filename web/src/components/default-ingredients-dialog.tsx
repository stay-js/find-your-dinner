'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { FilterCombobox } from '~/components/filter/filter-combobox';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Spinner } from '~/components/ui/spinner';
import { PUT } from '~/lib/api';
import { getDefaultIngredients, getIngredients } from '~/lib/queries';

type DefaultIngredientsDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DefaultIngredientsDialog({ onOpenChange, open }: DefaultIngredientsDialogProps) {
  const queryClient = useQueryClient();

  const { data: ingredients } = useQuery(getIngredients());
  const { data: defaultIngredientIds } = useQuery(getDefaultIngredients());

  const [localIds, setLocalIds] = useState<null | number[]>(null);
  const selectedIds = localIds ?? defaultIngredientIds ?? [];
  const portalContainerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () =>
      ingredients?.map((ingredient) => ({
        label: ingredient.name,
        value: ingredient.id,
      })) ?? [],
    [ingredients],
  );

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setLocalIds(null);
    onOpenChange(nextOpen);
  }

  const { isPending, mutate } = useMutation({
    mutationFn: (ingredientIds: number[]) => {
      return PUT('/api/user/default-ingredients', { ingredientIds });
    },
    onError: () => toast.error('Hiba történt a mentés során. Kérlek, próbáld újra később.'),
    onSuccess: () => {
      handleOpenChange(false);
      toast.success('Alapértelmezett hozzávalók sikeresen frissítve!');
      queryClient.invalidateQueries({ queryKey: ['currentUser', 'defaultIngredients'] });
    },
  });

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Alapértelmezett hozzávalók</DialogTitle>

          <DialogDescription>
            Az alábbi űrlap segítségével megadhatod, hogy mely hozzávalók állnak mindig
            rendelkezésedre, ezzel megkönnítve a receptek közötti keresést. A változtatások
            rögzítéséhez kattints a mentés gombra.
          </DialogDescription>
        </DialogHeader>

        <div className="absolute" ref={portalContainerRef} />

        <FilterCombobox
          label="Hozzávalók"
          onValueChange={setLocalIds}
          options={options}
          placeholder="Hozzávalók..."
          portalContainer={portalContainerRef}
          value={selectedIds}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Mégsem
            </Button>
          </DialogClose>

          <Button disabled={isPending} onClick={() => mutate(selectedIds)} type="button">
            {isPending && <Spinner />}
            <span>Mentés</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
