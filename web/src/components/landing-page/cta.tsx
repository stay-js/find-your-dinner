import { ArrowRight, CookingPot } from 'lucide-react';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

export function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-8 pt-24 pb-18">
        <div className="bg-primary/10 rounded-full p-4">
          <CookingPot className="text-primary size-8 fill-current" />
        </div>

        <div className="flex flex-col gap-4 text-center">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-pretty md:text-5xl">
            Készen állsz megtalálni a mai vacsorát?
          </h2>

          <p className="text-muted-foreground mx-auto max-w-lg text-lg text-pretty">
            Nyisd ki a hűtőt, vedd elő a telefonod, és induljon a keresés. Két perc, és megvan a
            vacsora.
          </p>
        </div>

        <Button asChild className="px-6 sm:px-8 sm:text-base" size="lg">
          <Link href="/find">
            <span>Próbáld ki</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
