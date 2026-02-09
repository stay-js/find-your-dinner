import { ChefHat, Clock, Users } from 'lucide-react';

export function Stats({
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
}: {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
}) {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2">
        <Clock className="text-muted-foreground size-5" />

        <div className="text-sm font-medium">Előkészítés: {prepTimeMinutes} perc</div>
      </div>

      <div className="flex items-center gap-2">
        <ChefHat className="text-muted-foreground size-5" />

        <div className="text-sm font-medium">Főzés/Sütés: {cookTimeMinutes} perc</div>
      </div>

      <div className="flex items-center gap-2">
        <Users className="text-muted-foreground size-5" />

        <div className="text-sm font-medium">{servings} adag</div>
      </div>
    </div>
  );
}
