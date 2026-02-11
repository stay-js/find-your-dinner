import Link from 'next/link';

import { Button } from '~/components/ui/button';

export function NotFound() {
  return (
    <main className="grid h-full min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-lg">A keresett tartalom nem található</p>
        </div>

        <Button asChild size="lg" className="w-fit">
          <Link href="/">Vissza a főoldalra</Link>
        </Button>
      </div>
    </main>
  );
}
