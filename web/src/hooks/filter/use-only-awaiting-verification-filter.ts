'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-create-query-string';

export function useOnlyAwaitingVerificationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const onlyAwaitingVerification = searchParams.get('only-awaiting-verification') === 'true';

  function handleOnlyAwaitingVerificationChange(checked: boolean) {
    const params = [
      { name: 'only-awaiting-verification', value: checked ? 'true' : 'false' },
      { name: 'page', value: '1' },
    ];

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  return { handleOnlyAwaitingVerificationChange, onlyAwaitingVerification };
}
