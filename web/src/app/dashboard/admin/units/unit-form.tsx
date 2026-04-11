import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '~/components/form';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { Spinner } from '~/components/ui/spinner';
import { type CreateUpdateUnitSchema, type Unit } from '~/lib/zod/schemas';

const formSchema = z.object({
  abbreviation: z
    .string()
    .trim()
    .min(1, { error: 'A rövidítés megadása kötelező!' })
    .max(16, { error: 'A rövidítés maximális hossza 16 karakter!' }),
  name: z
    .string()
    .trim()
    .min(1, { error: 'A név megadása kötelező!' })
    .max(64, { error: 'A név maximális hossza 64 karakter!' }),
});

type FormSchema = z.infer<typeof formSchema>;

type UnitFormProps = {
  isEditing: boolean;
  isOpen: boolean;
  isPending: boolean;
  onSubmit: (values: CreateUpdateUnitSchema) => void;
  selected: null | Unit;
  setIsOpen: (open: boolean) => void;
  setSelected: React.Dispatch<React.SetStateAction<null | Unit>>;
};

const defaultValues = { abbreviation: '', name: '' } satisfies FormSchema;

export function UnitForm({
  isEditing,
  isOpen,
  isPending,
  onSubmit,
  selected,
  setIsOpen,
  setSelected,
}: UnitFormProps) {
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    defaultValues: selected ?? defaultValues,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    reset(selected ?? defaultValues);
  }, [selected, reset, isOpen]);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent
        className="flex flex-col gap-0 p-0"
        onAnimationEnd={() => {
          if (!isOpen) setSelected(null);
        }}
      >
        <SheetHeader>
          <SheetTitle>Mértékegység {isEditing ? 'szerkesztése' : 'létrehozása'}</SheetTitle>
          <SheetDescription>
            A következő űrlap segítségével{' '}
            {isEditing ? 'szerkesztheted a kiválaszott ' : 'hozhatsz létre új '}
            mértékegységet. A mentés gombra kattintva tudod rögzíteni a változtatásokat.
          </SheetDescription>
        </SheetHeader>

        <form className="flex h-full flex-col overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <FormInput control={control} label="Név" name="name" />
            <FormInput control={control} label="Rövidítés" name="abbreviation" />
          </div>

          <SheetFooter>
            <Button disabled={isPending} size="lg" type="submit">
              {isPending && <Spinner />}
              <span>Mentés</span>
            </Button>

            <SheetClose asChild>
              <Button size="lg" type="button" variant="outline">
                Mégsem
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
