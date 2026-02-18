import { Badge } from '~/components/ui/badge';

type Category = {
  id: number;
  name: string;
};

export function Categories({ categories }: { categories: Category[] }) {
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
