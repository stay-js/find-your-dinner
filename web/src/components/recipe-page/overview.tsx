import type { Author } from '~/lib/zod';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

type OverviewProps = {
  author: Author | null;

  cookTimeMinutes: number;
  prepTimeMinutes: number;

  createdAt: Date;
  updatedAt: Date;
};

export function Overview({
  author,

  cookTimeMinutes,
  prepTimeMinutes,

  createdAt,
  updatedAt,
}: OverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Áttekintés</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Teljes elkészítési idő</span>
          <span className="font-medium">{prepTimeMinutes + cookTimeMinutes} perc</span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Létrehozás dátuma</span>
          <span className="font-medium">{createdAt.toLocaleDateString('hu-HU')}</span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Utolsó módosítás dátuma</span>
          <span className="font-medium">{updatedAt.toLocaleDateString('hu-HU')}</span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Feltöltötte</span>
          <span className="font-medium">
            {author?.firstName && author.lastName
              ? `${author.firstName} ${author.lastName}`
              : 'Ismeretlen'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
