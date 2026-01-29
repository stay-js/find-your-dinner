import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Bookmark, CheckCircle2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export type RecipeCardProps = {
  recipeId: number;
  title: string;
  previewImageUrl: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  verified: boolean;
  categories: {
    name: string;
    id: number;
  }[];
  isSaved?: boolean;

  showIsSaved?: boolean;
  showIsVerified?: boolean;
  pageType: 'tinder' | 'final' | 'manage' | 'search';
};

export function RecipeCard({
  recipeId,
  title,
  description,
  previewImageUrl,
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  verified = false,
  categories = [],
  isSaved = false,

  showIsSaved = true,
  showIsVerified = false,
  pageType,
}: RecipeCardProps) {
  return (
    <Card className="w-full max-w-sm gap-6 overflow-hidden pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={previewImageUrl || '/placeholder.svg'}
          alt={title}
          fill
          className="w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {showIsSaved && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 absolute top-3 right-3 backdrop-blur-sm"
          >
            <Bookmark className={cn('size-5', isSaved && 'fill-current')} />

            <span className="sr-only">
              {isSaved ? 'Törlés a mentett receptek közül' : 'Recept mentése'}
            </span>
          </Button>
        )}

        {showIsVerified && verified && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-600">
            <CheckCircle2 className="size-3" />
            <span>Jóváhagyva</span>
          </Badge>
        )}
      </div>

      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{prepTimeMinutes + cookTimeMinutes} perc</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>{servings} adag</span>
          </div>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          'grid grid-cols-1 gap-2 border-t',
          ['manage', 'tinder'].includes(pageType) && 'sm:grid-cols-2',
        )}
      >
        {pageType === 'search' && (
          <Button asChild>
            <Link href={`/recipes/${recipeId}`}>Megtekintés</Link>
          </Button>
        )}

        {pageType === 'final' && <Button>Ezt választom</Button>}

        {pageType === 'tinder' && (
          <>
            <Button variant="outline">Nem tetszik</Button>
            <Button>Tetszik</Button>
          </>
        )}

        {pageType === 'manage' && (
          <>
            <Button variant="outline">
              <Link href={`/dashboard/recipes/edit/${recipeId}`}>Szerkesztés</Link>
            </Button>

            <Button asChild>
              <Link href={`/recipes/${recipeId}`}>Megtekintés</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
