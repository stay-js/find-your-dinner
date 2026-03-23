import { type ReadonlyURLSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useMergeQueryString(searchParams: ReadonlyURLSearchParams) {
  const mergeQueryString = useCallback(
    (values: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(values).forEach(([name, value]) => params.set(name, value));

      return params.toString();
    },
    [searchParams],
  );

  return mergeQueryString;
}
