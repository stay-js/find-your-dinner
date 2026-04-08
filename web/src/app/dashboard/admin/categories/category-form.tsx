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
import { useDebouncedLoading } from '~/hooks/use-debounced-loading';
import { type Category, type CreateUpdateCategorySchema } from '~/lib/zod/schemas';

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'A név megadása kötelező!' })
    .max(128, { error: 'A név maximális hossza 128 karakter!' }),
});

type CategoryFormProps = {
  isEditing: boolean;
  isOpen: boolean;
  isPending: boolean;
  onSubmit: (values: CreateUpdateCategorySchema) => void;
  selected: Category | null;
  setIsOpen: (open: boolean) => void;
  setSelected: React.Dispatch<React.SetStateAction<Category | null>>;
};

type FormSchema = z.infer<typeof formSchema>;

const defaultValues = { name: '' } satisfies FormSchema;

export function CategoryForm({
  isEditing,
  isOpen,
  isPending,
  onSubmit,
  selected,
  setIsOpen,
  setSelected,
}: CategoryFormProps) {
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    defaultValues: selected ?? defaultValues,
    resolver: zodResolver(formSchema),
  });

  const showPending = useDebouncedLoading(isPending);

  useEffect(() => {
    reset(selected ?? defaultValues);
  }, [selected, reset]);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent
        className="flex flex-col gap-0 p-0"
        onAnimationEnd={() => {
          if (!isOpen) setSelected(null);
        }}
      >
        <SheetHeader>
          <SheetTitle>Kategória {isEditing ? 'szerkesztése' : 'létrehozása'}</SheetTitle>
          <SheetDescription>
            A következő űrlap segítségével{' '}
            {isEditing ? 'szerkesztheted a kiválaszott ' : 'hozhatsz létre új '}
            kategóriát. A mentés gombra kattintva tudod rögzíteni a változtatásokat.
          </SheetDescription>
        </SheetHeader>

        <form className="flex h-full flex-col overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <FormInput control={control} label="Név" name="name" />
          </div>

          <SheetFooter>
            <Button disabled={isPending} size="lg" type="submit">
              {showPending && <Spinner />}
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
