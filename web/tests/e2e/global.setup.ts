import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

import { env } from '~/env';

setup.describe.configure({ mode: 'serial' });

setup('global setup', async () => {
  await clerkSetup({
    publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: env.CLERK_SECRET_KEY,
  });
});
