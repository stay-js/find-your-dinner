import  { type Config } from 'drizzle-kit';

import { env } from '~/env';

const config = {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
} satisfies Config;

export default config;
