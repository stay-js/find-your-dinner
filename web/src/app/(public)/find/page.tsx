import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/find',

  description:
    'Válaszd ki a rendelkezésedre álló hozzávalókat, és mi megkeressük a megfelelő recepteket. Húzd jobbra, ha tetszik, balra, ha nem!',
  title: 'Keresés',
});

export default async function FindPage() {
  return (
    <div className="container flex h-full flex-col gap-6">
      <h1 className="text-foreground text-2xl font-semibold">Keresés</h1>
    </div>
  );
}
