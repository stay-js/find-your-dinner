import { clerkClient } from '@clerk/nextjs/server';

export async function getRecipeAuthor(userId: string) {
  const clerk = await clerkClient();

  try {
    const user = await clerk.users.getUser(userId);
    return {
      id: user.id,

      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      console.warn(`Clerk user with id ${userId} not found.`);
    } else {
      console.error(`Unexpected Clerk error while fetching user with id ${userId}:`, error);
    }

    return {
      id: userId,

      firstName: null,
      lastName: null,
    };
  }
}
