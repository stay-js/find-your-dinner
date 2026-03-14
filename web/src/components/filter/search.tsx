'use client';

import { Input } from '~/components/ui/input';
import { useSearch } from '~/hooks/filter/use-search';

export function Search() {
  const { handleQueryChange, query } = useSearch();

  return <Input onChange={handleQueryChange} placeholder="Keresés..." value={query} />;
}
