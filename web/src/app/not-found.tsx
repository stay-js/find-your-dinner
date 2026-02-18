import { Footer } from '~/components/footer';
import { NotFound } from '~/components/not-found';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/404',

  description: 'A keresett tartalom nem található',
  title: '404',

  noIndex: true,
});

export default function NotFoundPage() {
  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <NotFound />
      <Footer />
    </div>
  );
}
