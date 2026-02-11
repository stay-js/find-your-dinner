import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/404',
  title: '404',
  description: 'A keresett tartalom nem található',
  noIndex: true,
});

import { NotFound } from '~/components/not-found';

export default function NotFoundPage() {
  return <NotFound />;
}
