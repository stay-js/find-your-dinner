import { Pencil } from 'lucide-react';

import { DeletePopover } from '~/components/delete-popover';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { type Category } from '~/lib/zod';

type CategoryProps = {
  category: Category;
  isDestroyPending: boolean;
  onDelete: () => void;
  onEdit: () => void;
};

export function Category({ category, isDestroyPending, onDelete, onEdit }: CategoryProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <span className="min-w-0 truncate text-sm">{category.name}</span>

        <div className="flex gap-2">
          <Button onClick={onEdit} size="icon-sm" type="button" variant="outline">
            <Pencil className="size-3.5" />
          </Button>

          <DeletePopover
            disabled={!category.canBeDeleted}
            isPending={isDestroyPending}
            onDelete={onDelete}
            type="Kategória"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function CategorySkeleton() {
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
