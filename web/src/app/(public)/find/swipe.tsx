import { type Recipe } from '~/lib/zod';

import { type FindPageSetState } from './find';

type SwipeProps = {
  setLikedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setState: FindPageSetState;
};

export function Swipe({ setLikedRecipes, setState }: SwipeProps) {
  return <div></div>;
}
