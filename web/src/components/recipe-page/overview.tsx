import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export function Overview({
  prepTimeMinutes,
  cookTimeMinutes,
  createdAt,
  updatedAt,
  owner,
}: {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}) {
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
            {owner ? `${owner.firstName ?? ''} ${owner.lastName ?? ''}` : 'Ismeretlen'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
