import { SetRecipeTitle } from '~/contexts/recipe-title-context';
import { type getRecipe } from '~/server/utils/get-recipe';

import { Categories } from './categories';
import { Ingredients } from './ingredients';
import { Instructions } from './instructions';
import { Overview } from './overview';
import { PreviewImage } from './preview-image';
import { Stats } from './stats';
import { Title } from './title';

type Recipe = Awaited<ReturnType<typeof getRecipe>>;

interface RecipePageProps extends Recipe {
  children?: React.ReactNode;
  isAdmin: boolean;
  userId: null | string;
}

export function RecipePage({
  author,
  categories,
  children,
  ingredients,
  isAdmin,
  recipe,
  recipeData,
  userId,
}: RecipePageProps) {
  return (
    <div className="@container">
      <SetRecipeTitle title={recipeData.title} />

      <div className="container grid gap-6 @5xl:grid-cols-[5fr_2fr] @6xl:grid-cols-[3fr_1fr]">
        <div className="flex flex-col gap-6">
          {children}

          <PreviewImage previewImageUrl={recipeData.previewImageUrl} title={recipeData.title} />

          <Title
            description={recipeData.description}
            isAdmin={isAdmin}
            isAuthor={userId === recipe.userId}
            recipeId={recipe.id}
            title={recipeData.title}
          />

          <Categories categories={categories} />

          <Stats
            cookTimeMinutes={recipeData.cookTimeMinutes}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            recipeId={recipe.id}
            servings={recipeData.servings}
          />

          <Ingredients
            className="@5xl:hidden"
            ingredients={ingredients}
            servings={recipeData.servings}
          />

          <Instructions instructions={recipeData.instructions} />

          <Overview
            author={author}
            cookTimeMinutes={recipeData.cookTimeMinutes}
            createdAt={recipeData.createdAt!}
            prepTimeMinutes={recipeData.prepTimeMinutes}
            updatedAt={recipeData.updatedAt!}
          />
        </div>

        <Ingredients
          className="sticky top-22 @max-5xl:hidden"
          ingredients={ingredients}
          servings={recipeData.servings}
        />
      </div>
    </div>
  );
}
