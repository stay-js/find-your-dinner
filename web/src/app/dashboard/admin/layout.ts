import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { checkIsAdmin } from '~/server/utils/check-is-admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) redirect('/sign-in');

  const isAdmin = await checkIsAdmin(userId);
  if (!isAdmin) redirect('/forbidden');

  return children;
}
