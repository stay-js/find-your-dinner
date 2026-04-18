import { About, CTA, Features, Hero, Tournament } from '~/components/landing-page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',

  description:
    'Találd meg a mai vacsorát! Add meg mi van a hűtőben, pörgesd végig a neked ajánlott recepteket, majd bízd a választást egy gyors versenyre. Egy győztes recept, nulla agyalás. Három lépés a vacsoráig!',
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
