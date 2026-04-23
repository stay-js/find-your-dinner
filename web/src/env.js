import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,

    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    TEST_E2E_CLERK_USER_PASSWORD: process.env.TEST_E2E_CLERK_USER_PASSWORD,
    TEST_E2E_CLERK_USER_USERNAME: process.env.TEST_E2E_CLERK_USER_USERNAME,

    TEST_E2E_CLERK_ADMIN_PASSWORD: process.env.TEST_E2E_CLERK_ADMIN_PASSWORD,
    TEST_E2E_CLERK_ADMIN_USERNAME: process.env.TEST_E2E_CLERK_ADMIN_USERNAME,

    NODE_ENV: process.env.NODE_ENV,
  },
  server: {
    DATABASE_URL: z.url(),
    TEST_DATABASE_URL: z.url().optional(),

    CLERK_SECRET_KEY: z.string(),

    TEST_E2E_CLERK_USER_PASSWORD: z.string().optional(),
    TEST_E2E_CLERK_USER_USERNAME: z.string().optional(),

    TEST_E2E_CLERK_ADMIN_PASSWORD: z.string().optional(),
    TEST_E2E_CLERK_ADMIN_USERNAME: z.string().optional(),

    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
