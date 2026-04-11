import { Heart, X } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function About() {
  return (
    <section className="bg-muted/40 border-t" id="about">
      <div className="container flex flex-col gap-16 py-24">
        <div className="flex flex-col items-center justify-center gap-4">
          <Badge className="px-4 py-3" variant="outline">
            Hogyan működik?
          </Badge>

          <h2 className="max-w-lg text-center text-3xl font-bold tracking-tight md:text-4xl">
            Három lépés a vacsoráig
          </h2>
          <p className="text-muted-foreground max-w-xl text-center">
            Hozzávalóktól a receptig két percen belül. Vége a receptblogok végtelen böngészésének.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-primary/5 hover:ring-primary/30 transition-all hover:shadow-md">
            <CardHeader className="gap-3">
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 grid size-12 place-content-center rounded-full text-sm font-bold transition-colors">
                <span className="text-base">01</span>
              </div>

              <CardTitle className="text-lg">Add meg a hozzávalókat</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-base">
                Add meg, hogy mi van otthon - csirke, rizs, paradicsom, bármi, ami a rendelkezésre
                áll.
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-auto flex flex-wrap gap-2">
              {['🍗 Csirke', '🧄 Fokhagyma', '🍅 Paradicsom', '🧀 Sajt', '🌿 Bazsalikom'].map(
                (ingredient) => (
                  <Badge className="text-xs" key={ingredient} variant="outline">
                    {ingredient}
                  </Badge>
                ),
              )}
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-primary/5 hover:ring-primary/30 transition-all hover:shadow-md">
            <CardHeader className="gap-3">
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 grid size-12 place-content-center rounded-full text-sm font-bold transition-colors">
                <span className="text-base">02</span>
              </div>

              <CardTitle className="text-lg">Pörgessd végig a recepteket</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-base">
                Olyan, mint a Tinder. Húzd jobbra, ha tetszik, balra, ha nem. Ha végig értél,
                indulhat a verseny.
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-destructive/10 rounded-full p-2.5">
                  <X className="text-destructive size-5" />
                </div>

                <span className="text-muted-foreground text-xs">Nem tetszik</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-chart-2/10 rounded-full p-2.5">
                  <Heart className="text-chart-2 size-5 fill-current" />
                </div>

                <span className="text-muted-foreground text-xs">Tetszik</span>
              </div>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-primary/5 hover:ring-primary/30 transition-all hover:shadow-md max-lg:col-span-full">
            <CardHeader className="gap-3">
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 grid size-12 place-content-center rounded-full text-sm font-bold transition-colors">
                <span className="text-base">03</span>
              </div>

              <CardTitle className="text-lg">Válaszd ki a győztest</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-base">
                A kedvenc receptjeid párokban mérkőznek meg egymással. Te dönthetsz, hogy melyik
                jusson tovább, míg végül egyetlen recept marad.
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-center gap-2">
              <div className="bg-secondary rounded-lg border px-3 py-1.5 text-xs font-medium">
                Tészta 🍝
              </div>

              <span className="text-primary text-sm font-bold">VS</span>

              <div className="bg-secondary rounded-lg border px-3 py-1.5 text-xs font-medium">
                Wok 🥘
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
