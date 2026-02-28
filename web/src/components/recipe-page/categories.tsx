import { Badge } from '~/components/ui/badge';
import { type Categories } from '~/lib/zod';

export function Categories({ categories }: { categories: Categories }) {
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
