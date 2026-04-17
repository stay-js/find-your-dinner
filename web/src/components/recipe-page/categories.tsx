import { Badge } from '~/components/ui/badge';
import { type Category } from '~/lib/zod';

export function Categories({ categories }: { categories: Omit<Category, 'canBeDeleted'>[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge key={category.id} variant="secondary">
          {category.name}
        </Badge>
      ))}
    </div>
  );
}
