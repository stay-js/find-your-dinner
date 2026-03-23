'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { useCategoriesFilter, useIngredientsFilter } from '~/hooks/filter';

import { CategoriesFilter } from './categories-filter';
import { IngredientsFilter } from './ingredients-filter';
import { Search } from './search';

type RecipeFiltersProps = {
  children?: React.ReactNode;
  extraFilterActive?: boolean;
};

export function RecipeFilters({ children, extraFilterActive }: RecipeFiltersProps) {
  const { selectedCategories } = useCategoriesFilter();
  const { selectedIngredients } = useIngredientsFilter();

  const [showFilters, setShowFilters] = useState(
    selectedCategories.length > 0 || selectedIngredients.length > 0 || (extraFilterActive ?? false),
  );

  return (
    <Collapsible className="flex flex-col gap-2" onOpenChange={setShowFilters} open={showFilters}>
      <div className="flex gap-2 max-sm:flex-col">
        <Search />

        <CollapsibleTrigger asChild>
          <Button onClick={() => setShowFilters((val) => !val)} variant="outline">
            {showFilters ? <EyeOff /> : <Eye />}
            <span>Szűrők</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <Card>
          <CardHeader>
            <CardTitle>Szűrők</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 lg:flex-row lg:gap-x-3">
            <IngredientsFilter />
            <CategoriesFilter />
          </CardContent>

          {children && <CardFooter>{children}</CardFooter>}
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
