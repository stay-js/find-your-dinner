import { Footer } from '~/components/footer';
import { createMetadata } from '~/lib/create-metadata';
import { NotFound } from '~/components/not-found';

export const metadata = createMetadata({
  path: '/404',
  title: '404',
  description: 'A keresett tartalom nem található - Find Your Dinner.',
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
