import { clerkClient } from '@clerk/nextjs/server';

export async function getRecipeAuthor(userId: string) {
  const clerk = await clerkClient();

  const user = await clerk.users.getUser(userId);

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
