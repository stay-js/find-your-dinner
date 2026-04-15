import { About, CTA, Features, Hero, Tournament } from '~/components/landing-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',

  description: 'Üdvözöljük a Find Your Dinner. alkalmazásban!',
  title: 'Főoldal',
});

export default async function PublicLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Features />
      <Tournament />
      <CTA />
    </div>
  );
}
