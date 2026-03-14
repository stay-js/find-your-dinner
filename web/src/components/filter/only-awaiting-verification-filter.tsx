'use client';

import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { useOnlyAwaitingVerificationFilter } from '~/hooks/filter/use-only-awaiting-verification-filter';

export function OnlyAwaitingVerificationFilter() {
  const { handleOnlyAwaitingVerificationChange, onlyAwaitingVerification } =
    useOnlyAwaitingVerificationFilter();

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={onlyAwaitingVerification}
        id="only-awaiting-verification"
        onCheckedChange={handleOnlyAwaitingVerificationChange}
      />

      <Label htmlFor="only-awaiting-verification">Csak jóváhagyásra váró receptek</Label>
    </div>
  );
}
