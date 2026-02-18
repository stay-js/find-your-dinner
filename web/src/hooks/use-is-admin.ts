'use client';

import { useQuery } from '@tanstack/react-query';

import { GET } from '~/lib/api-utils';
import { isAdminSchema } from '~/lib/zod';

export function useIsAdmin() {
  const { data, isError, isLoading } = useQuery({
    queryFn: () => GET('/api/admin/is-admin', isAdminSchema),
    queryKey: ['is-admin'],
    retry: false,
  });

  return {
    isAdmin: data?.isAdmin ?? false,
    isError,
    isLoading,
  };
}
