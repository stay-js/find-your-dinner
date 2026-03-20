import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export function Instructions({ instructions }: { instructions: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elkészítés</CardTitle>
      </CardHeader>

      <CardContent className="leading-relaxed whitespace-pre-wrap">{instructions}</CardContent>
    </Card>
  );
}
