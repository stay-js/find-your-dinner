import { type ReadonlyURLSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useCreateQueryString(searchParams: ReadonlyURLSearchParams) {
  const createQueryString = useCallback(
    (values: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());

      values.forEach(({ name, value }) => params.set(name, value));

      return params.toString();
    },
    [searchParams],
  );

  return createQueryString;
}
