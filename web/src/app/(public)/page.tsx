import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',
  title: 'Főoldal - Find Your Dinner.',
  description: 'Üdvözöljük a Find Your Dinner. alkalmazásban!',
});

export default async function LandingPage() {
  return (
    <div className="container">
      <h1 className="text-2xl font-semibold">Find Your Dinner.</h1>
    </div>
  );
}
