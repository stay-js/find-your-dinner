'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMergeQueryString } from '~/hooks/use-merge-query-string';

export function useOnlyAwaitingVerificationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const onlyAwaitingVerification = searchParams.get('only-awaiting-verification') === 'true';

  function handleOnlyAwaitingVerificationChange(checked: boolean) {
    const params = {
      'only-awaiting-verification': checked.toString(),
      page: '1',
    };

    router.replace(`${pathname}?${mergeQueryString(params)}`);
  }

  return { handleOnlyAwaitingVerificationChange, onlyAwaitingVerification };
}
