'use client';

import { createContext, useContext, useState } from 'react';

import { DefaultIngredientsDialog } from '~/components/default-ingredients-dialog';

const DefaultIngredientsDialogContext = createContext<null | {
  setOpen: (open: boolean) => void;
}>(null);

export function DefaultIngredientsDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DefaultIngredientsDialogContext.Provider value={{ setOpen }}>
      {children}

      <DefaultIngredientsDialog onOpenChange={setOpen} open={open} />
    </DefaultIngredientsDialogContext.Provider>
  );
}

export function useDefaultIngredientsDialog() {
  const context = useContext(DefaultIngredientsDialogContext);

  if (!context) {
    throw new Error(
      'useDefaultIngredientsDialog must be used within DefaultIngredientsDialogProvider',
    );
  }

  return context;
}
