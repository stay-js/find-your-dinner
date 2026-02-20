'use client';

import { useQuery } from '@tanstack/react-query';

import { GET } from '~/lib/api';
import { isAdminSchema } from '~/lib/zod';

export function useIsAdmin() {
  const { data, isError, isLoading } = useQuery({
    queryFn: () => GET('/api/user/is-admin', isAdminSchema),
    queryKey: ['currentUser', 'isAdmin'],
    retry: false,
  });

  return {
    isAdmin: data?.isAdmin ?? false,
    isError,
    isLoading,
  };
}
