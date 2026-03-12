import { type ReadonlyURLSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useMergeQueryString(searchParams: ReadonlyURLSearchParams) {
  const mergeQueryString = useCallback(
    (values: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());

      values.forEach(({ name, value }) => params.set(name, value));

      return params.toString();
    },
    [searchParams],
  );

  return mergeQueryString;
}
