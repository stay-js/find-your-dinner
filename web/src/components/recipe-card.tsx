import { useSession } from '@clerk/nextjs';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import Link from 'next/link';

import { SafeImage } from '~/components/safe-image';
import { SaveButton } from '~/components/save-button';
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
import { cn } from '~/lib/utils';
import { type Recipe } from '~/lib/zod';

type RecipeCardProps = {
  pageType: 'admin' | 'manage' | 'saved' | 'search' | 'tinder' | 'tournament';

  recipe: Recipe;
  showIsVerified?: boolean;

  onDislike?: () => void;
  onLike?: (id: number) => void;

  onSelect?: (id: number) => void;
};

export function RecipeCard({
  pageType,
  recipe,
  showIsVerified = false,

  onDislike,
  onLike,

  onSelect,
}: RecipeCardProps) {
  const { isSignedIn } = useSession();

  return (
    <Card className="w-full gap-6 overflow-hidden pt-0">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <SafeImage
          alt={recipe.recipeData.title}
          className="w-full object-cover transition-transform duration-300 hover:scale-105"
          draggable={false}
          fill
          src={recipe.recipeData.previewImageUrl || '/placeholder.png'}
        />

        {isSignedIn && (
          <SaveButton
            className="bg-background/80 absolute top-3 right-3 backdrop-blur-sm"
            recipeId={recipe.recipe.id}
            variant="ghost"
          />
        )}

        {showIsVerified && recipe.recipeData.verified && (
          <Badge className="dark:text-foreground absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-600">
            <CheckCircle2 className="size-3" />
            <span>Jóváhagyva</span>
          </Badge>
        )}
      </div>

      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {recipe.categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <CardTitle className="line-clamp-1 font-semibold">{recipe.recipeData.title}</CardTitle>
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

        {pageType === 'tinder' && (
          <>
            <Button onClick={onDislike} variant="outline">
              <span>Nem tetszik</span>
            </Button>

            <Button onClick={() => onLike?.(recipe.recipe.id)}>
              <span>Tetszik</span>
            </Button>
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

        {pageType === 'tournament' && (
          <Button onClick={() => onSelect?.(recipe.recipe.id)}>
            <span>Ezt választom</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
