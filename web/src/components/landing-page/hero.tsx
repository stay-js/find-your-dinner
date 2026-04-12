'use client';

import { ArrowRight, ChefHat, Clock, Heart, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--chart-1)_0%,transparent_50%)] opacity-10" />

      <div className="container flex flex-col items-center gap-8 py-24 lg:py-32">
        <Badge className="gap-1.5 px-4 py-3" variant="outline">
          <Sparkles className="size-3.5" />
          <span>Ne görgess tovább, kezdj főzni</span>
        </Badge>

        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-tighter text-pretty md:text-6xl lg:text-7xl">
            Találd meg a mai{' '}
            <span className="from-chart-2 to-primary bg-linear-to-r bg-clip-text text-transparent">
              vacsorát
            </span>
          </h1>

          <p className="text-muted-foreground max-w-xl text-lg text-pretty md:text-xl">
            Add meg mi van a hűtőben, pörgesd végig a neked ajánlott recepteket, majd bízd a
            választást egy gyors versenyre. Egy győztes recept, nulla agyalás.
          </p>
        </div>

        <div className="flex items-center gap-4 max-sm:flex-col">
          <Button asChild className="px-8 text-base" size="lg">
            <Link href="/find">
              <span>Próbáld ki</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button
            className="px-8 text-base"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            variant="outline"
          >
            Hogyan működik?
          </Button>
        </div>

        <div className="relative w-full max-w-sm pt-8">
          <Card className="shadow-primary/10 gap-3 rounded-3xl p-4 shadow-2xl ring-2">
            <div className="from-chart-1/30 via-chart-3/20 to-chart-5/30 relative flex aspect-3/4 flex-col justify-end gap-6 overflow-hidden rounded-xl bg-linear-to-br p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/90 gap-1.5 px-2">
                    <Clock className="size-3" />
                    <span className="tracking-tighter">25 p</span>
                  </Badge>

                  <Badge className="gap-1.5 px-2" variant="secondary">
                    <ChefHat className="size-3" />
                    <span className="tracking-tighter">25 p</span>
                  </Badge>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground text-xl font-bold">Fokhagymás toszkán csirke</h3>

                  <p className="text-muted-foreground text-sm">
                    Aszalt paradicsom, spenót, parmezán
                  </p>
                </div>
              </div>

              <span className="text-muted-foreground text-xs">2.3k mentés</span>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div className="border-destructive/30 bg-destructive/10 hover:bg-destructive/20 rounded-full border-2 p-4 transition-colors">
                <X className="text-destructive size-6" />
              </div>

              <div className="dark:hover-chart-3/20 border-chart-2/30 bg-chart-2/20 hover:bg-chart-2/35 rounded-full border-2 p-4 transition-colors">
                <Heart className="text-chart-2 size-6 fill-current" />
              </div>
            </div>
          </Card>

          <Card className="absolute top-20 -left-4 rotate-[-8deg] py-2 shadow-lg">
            <CardContent className="px-3">
              <span className="text-sm font-medium">👎 Nem</span>
            </CardContent>
          </Card>

          <Card className="absolute top-20 -right-4 rotate-[8deg] py-2 shadow-lg">
            <CardContent className="px-3">
              <span className="text-sm font-medium">Tetszik! 👍</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
