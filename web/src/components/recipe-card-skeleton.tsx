import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function RecipeCardSkeleton() {
  return (
    <Card className="w-full gap-6 overflow-hidden pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />

        <Skeleton className="absolute top-3 right-3 size-9 rounded-md" />
      </div>

      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className="h-5 w-16 rounded-full" key={i} />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto grid grid-cols-2 gap-2 border-t">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
