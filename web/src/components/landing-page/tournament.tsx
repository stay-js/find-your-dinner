import { Check, Trophy } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';

export function Tournament() {
  return (
    <section className="bg-muted/40 overflow-hidden border-t">
      <div className="container flex flex-col items-center gap-12 py-24 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-6">
          <Badge className="gap-2 px-4 py-3" variant="outline">
            <Trophy className="size-3 fill-current" />
            <span>A verseny</span>
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Versenyezzenek a kedvenceid
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            A kedvenc receptjeid párokban mérkőznek meg egymással. Te dönthetsz, hogy melyik jusson
            tovább, míg végül egyetlen recept marad.
          </p>

          <ul className="text-muted-foreground flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                <Check className="size-3.5" />
              </div>

              <span>Vége a &quot;mit együnk&quot; vitáknak</span>
            </li>

            <li className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                <Check className="size-3.5" />
              </div>
              <span>Pároknak és családoknak is remek megoldás</span>
            </li>

            <li className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                <Check className="size-3.5" />
              </div>

              <span>Eredmény 2 percen belül</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                <Card className="border-primary/30 bg-card w-36 border-2 sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-lg">🍝</span>
                    <span className="text-xs font-medium sm:text-sm">Carbonara</span>
                  </CardContent>
                </Card>

                <Card className="border-muted bg-card w-36 border-2 opacity-50 sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-lg">🥗</span>
                    <span className="text-xs font-medium line-through sm:text-sm">
                      Cézár saláta
                    </span>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="bg-border h-8 w-px" />
                <span className="text-primary font-medium">→</span>
                <div className="bg-border h-8 w-px" />
              </div>

              <div className="flex flex-col gap-4">
                <Card className="border-primary bg-primary/5 shadow-primary/10 w-36 border-2 shadow-md sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-xs font-bold sm:text-sm">🍝 Carbonara</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                <Card className="border-muted bg-card w-36 border-2 opacity-50 sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-lg">🌮</span>
                    <span className="text-xs font-medium line-through sm:text-sm">Taco</span>
                  </CardContent>
                </Card>

                <Card className="border-primary/30 bg-card w-36 border-2 sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-lg">🍛</span>
                    <span className="text-xs font-medium sm:text-sm">Curry</span>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="bg-border h-8 w-px" />
                <span className="text-primary font-medium">→</span>
                <div className="bg-border h-8 w-px" />
              </div>

              <div className="flex flex-col gap-4">
                <Card className="border-muted bg-card w-36 border-2 opacity-60 sm:w-48">
                  <CardContent className="flex items-center gap-2 p-3">
                    <span className="text-lg">🍛</span>
                    <span className="text-xs font-medium sm:text-sm">Curry</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
