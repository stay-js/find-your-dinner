import Link from 'next/link';

import { Footer } from '~/components/footer';
import { Button } from '~/components/ui/button';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/forbidden',

  description: 'Nem vagy jogosult a tartalom megtekintésére - Find Your Dinner.',
  title: '403',

  noIndex: true,
});

export default function ForbiddenPage() {
  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <main className="grid h-full min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <h1 className="text-6xl font-bold">403</h1>
            <p className="text-lg">Nem vagy jogosult a tartalom megtekintésére</p>
          </div>

          <Button asChild className="w-fit" size="lg">
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
