import { Pencil } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

type TitleProps = {
  recipeId: number;

  description: string;
  title: string;

  isAdmin: boolean;
  isAuthor: boolean;
};

export function Title({
  recipeId,

  description,
  title,

  isAdmin,
  isAuthor,
}: TitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

        {(isAdmin || isAuthor) && (
          <Button asChild size="sm" variant="outline">
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
