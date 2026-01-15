import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',
  title: 'Főoldal',
  description: 'Üdvözöljük a Recept Tinder alkalmazásban!',
});

export default async function Page() {
  return <div>Főoldal</div>;
}
