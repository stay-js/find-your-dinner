import Link from 'next/link';
import { Pencil } from 'lucide-react';

import { Button } from '~/components/ui/button';

export function Title({
  isAdmin,
  isAuthor,
  recipeId,
  title,
  description,
}: {
  isAdmin: boolean;
  isAuthor: boolean;
  recipeId: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

        {(isAdmin || isAuthor) && (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={
                isAuthor
                  ? `/dashboard/recipes/edit/${recipeId}`
                  : `/dashboard/admin/recipes/edit/${recipeId}`
              }
            >
              <Pencil className="size-4" />
              <span>Szerkesztés</span>
            </Link>
          </Button>
        )}
      </div>

      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
