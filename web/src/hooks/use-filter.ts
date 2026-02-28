'use client';

import Fuse from 'fuse.js';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

export function useFilter<T>(items: T[] | undefined = [], keys: string[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounceValue(query, 300);

  const filteredItems = debouncedQuery
    ? new Fuse(items, { keys, threshold: 0.2 }).search(debouncedQuery).map((result) => result.item)
    : items;

  const isFiltering = query !== debouncedQuery;

  return { filteredItems, isFiltering, query, setQuery };
}
