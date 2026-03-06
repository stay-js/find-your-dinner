'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type RecipeTitleContextType = {
  setTitle: React.Dispatch<React.SetStateAction<null | string>>;
  title: null | string;
};

const RecipeTitleContext = createContext<null | RecipeTitleContextType>(null);

export function RecipeTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<null | string>(null);

  return (
    <RecipeTitleContext.Provider value={{ setTitle, title }}>
      {children}
    </RecipeTitleContext.Provider>
  );
}

export function SetRecipeTitle({ title }: { title: string }) {
  const ctx = useContext(RecipeTitleContext);

  useEffect(() => {
    ctx?.setTitle(title);
    return () => ctx?.setTitle(null);
  }, [title, ctx]);

  return null;
}

export function useRecipeTitle() {
  return useContext(RecipeTitleContext)?.title;
}
