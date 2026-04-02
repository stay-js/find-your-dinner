import { createMetadata } from '~/lib/create-metadata';

import { Find } from './find';

export const metadata = createMetadata({
  path: '/find',

  description:
    'Válaszd ki a rendelkezésedre álló hozzávalókat, és mi megkeressük a megfelelő recepteket. Húzd jobbra, ha tetszik, balra, ha nem!',
  title: 'Keresés',
});

export default async function PublicFindPage() {
  return <Find />;
}
