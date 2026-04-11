import { Clock, Filter, Heart, Sparkles, Users, Utensils } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
const features = [
  {
    description:
      'Algoritmusunk a ténylegesen rendelkezésre álló hozzávalók alapján ajánlja a legjobb recepteket, így nem kell feleslegesen boltba menned.',
    icon: Filter,
    title: 'Szűrés hozzávalók alapján',
  },
  {
    description: 'A gyors hétköznapi vacsoráktól a hétvégi projektekig mindig találsz valami újat.',
    icon: Utensils,
    title: 'Rengeteg recept',
  },
  {
    description:
      'Akár egy főre, akár nagyobb társaságnak főzöl, az adagokat a vendégek számához igazíthatod.',
    icon: Users,
    title: 'Rugalmas adagolás',
  },
  {
    description:
      'Minden recepthez pontos időbecslést adunk, hogy tudd, mennyi időt kell a konyhában töltened.',
    icon: Clock,
    title: 'Pontos időbecslés',
  },
  {
    description:
      'Mentsd el a kedvenceidet, és építs saját receptgyűjteményt, amit bármikor újra elővehetsz.',
    icon: Heart,
    title: 'Kedvencek mentése',
  },
  {
    description:
      'A kieséses rendszer leveszi rólad a döntés terhét. Egy recept marad, és már tudod is, hogy mit főzz.',
    icon: Sparkles,
    title: 'Kevesebb döntés, több főzés',
  },
];

export function Features() {
  return (
    <section className="border-t" id="features">
      <div className="container flex flex-col gap-16 py-24">
        <div className="flex flex-col items-center justify-center gap-4">
          <Badge className="px-4 py-3" variant="outline">
            Funkciók
          </Badge>

          <h2 className="max-w-lg text-center text-3xl font-bold tracking-tight md:text-4xl">
            Miért fogod szeretni?
          </h2>
          <p className="text-muted-foreground max-w-xl text-center">
            A társkeresők legjobb funkcióit a nap legnehezebb döntésére hangoltuk.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              className="group hover:shadow-primary/5 hover:ring-primary/30 transition-all hover:shadow-md"
              key={feature.title}
            >
              <CardHeader className="gap-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 w-fit rounded-full p-3 transition-colors">
                  <feature.icon className="text-primary size-4" />
                </div>

                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
