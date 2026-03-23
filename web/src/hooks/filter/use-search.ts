'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { useDebouncedCallback } from '~/hooks/use-debounce';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const debouncedQuery = searchParams.get('query')?.trim() ?? '';
  const [query, setQuery] = useState(debouncedQuery);

  const navigateQuery = useDebouncedCallback((q: string) => {
    const params = {
      page: '1',
      query: q,
    };

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  });

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    navigateQuery(e.target.value);
  }

  return { debouncedQuery, handleQueryChange, query };
}
