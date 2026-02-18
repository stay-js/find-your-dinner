import { Bookmark, CheckCircle2, Clock, Users } from 'lucide-react';
import Link from 'next/link';

import { SafeImage } from '~/components/safe-image';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useSaveState } from '~/hooks/use-save-state';
import { cn } from '~/lib/utils';
import { type Recipe } from '~/lib/zod';

type RecipeCardProps = {
  pageType: 'admin' | 'final' | 'manage' | 'saved' | 'search' | 'tinder';
  recipe: Recipe;
  showIsVerified?: boolean;
};

export function RecipeCard({ pageType, recipe, showIsVerified = false }: RecipeCardProps) {
  const { handleSaveToggle, isPending, isSaved } = useSaveState(recipe.recipe.id);

  return (
    <Card className="w-full gap-6 overflow-hidden pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <SafeImage
          alt={recipe.recipeData.title}
          className="w-full object-cover transition-transform duration-300 hover:scale-105"
          fill
          src={recipe.recipeData.previewImageUrl || '/placeholder.png'}
        />

        <Button
          className="bg-background/80 absolute top-3 right-3 backdrop-blur-sm"
          disabled={isPending}
          onClick={handleSaveToggle}
          size="icon"
          variant="ghost"
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
            <Badge className="text-xs" key={category.id} variant="secondary">
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
          (pageType === 'tinder' || (pageType === 'manage' && recipe.recipeData.verified)) &&
            'sm:grid-cols-2',
        )}
      >
        {pageType === 'admin' && (
          <Button asChild>
            <Link href={`/dashboard/admin/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
          </Button>
        )}

        {pageType === 'search' && (
          <Button asChild>
            <Link href={`/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
          </Button>
        )}

        {pageType === 'saved' && (
          <Button asChild>
            <Link href={`/dashboard/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
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
          <Button asChild variant="outline">
            <Link href={`/dashboard/recipes/${recipe.recipe.id}/edit`}>Szerkesztés</Link>
          </Button>
        )}

        {pageType === 'manage' && recipe.hasVerifiedVersion && (
          <Button asChild>
            <Link href={`/dashboard/recipes/${recipe.recipe.id}`}>Megtekintés</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
