import { Pencil } from 'lucide-react';

import { DeletePopover } from '~/components/delete-popover';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { type Unit } from '~/lib/zod';

type UnitProps = {
  onDelete: () => void;
  onEdit: () => void;
  unit: Unit;
};

export function Unit({ onDelete, onEdit, unit }: UnitProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <span className="min-w-0 truncate text-sm">
          {unit.name} ({unit.abbreviation})
        </span>

        <div className="flex gap-2">
          <Button onClick={onEdit} size="icon-sm" type="button" variant="outline">
            <Pencil className="size-3.5" />
          </Button>

          <DeletePopover onDelete={onDelete} type="Mértékegység" />
        </div>
      </CardContent>
    </Card>
  );
}

export function UnitSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-48" />

        <div className="flex gap-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
