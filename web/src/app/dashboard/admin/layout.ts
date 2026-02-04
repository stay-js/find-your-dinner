import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { checkIsAdmin } from '~/server/utils/check-is-admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId, redirectToSignIn } = await auth();
  if (!isAuthenticated) redirectToSignIn();

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) redirect('/forbidden');

  return children;
}
