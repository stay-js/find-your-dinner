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
import type { Recipe } from '~/lib/zod-schemas';
import { cn } from '~/lib/utils';

export function RecipeCard({
  pageType,
  recipe,
  isSaved = false,
  showIsVerified = false,
}: {
  pageType: 'tinder' | 'final' | 'manage' | 'search';
  recipe: Recipe;
  isSaved: boolean;
  showIsVerified?: boolean;
}) {
  return (
    <Card className="w-full max-w-sm gap-6 overflow-hidden pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={recipe.recipeData.previewImageUrl || '/placeholder.svg'}
          alt={recipe.recipeData.title}
          fill
          className="w-full object-cover transition-transform duration-300 hover:scale-105"
        />

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

        {showIsVerified && recipe.recipeData.verified && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-600">
            <CheckCircle2 className="size-3" />
            <span>Jóváhagyva</span>
          </Badge>
        )}
      </div>

      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {recipe.categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <CardTitle className="line-clamp-1 text-lg">{recipe.recipeData.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {recipe.recipeData.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>
              {recipe.recipeData.prepTimeMinutes + recipe.recipeData.cookTimeMinutes} perc
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>{recipe.recipeData.servings} adag</span>
          </div>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          'mt-auto grid grid-cols-1 gap-2 border-t',
          ['manage', 'tinder'].includes(pageType) && 'sm:grid-cols-2',
        )}
      >
        {pageType === 'search' && (
          <Button asChild>
            <Link href={`/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
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
              <Link href={`/dashboard/recipes/edit/${recipe.recipe.id}`}>Szerkesztés</Link>
            </Button>

            <Button asChild>
              <Link href={`/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
