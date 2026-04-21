import { drizzle } from 'drizzle-orm/node-postgres';
import { type Pool as PgPool, Pool } from 'pg';

import { env } from '~/env';
import * as schema from '~/server/db/schema';

const globalForDb = globalThis as unknown as { conn: PgPool | undefined };

const connectionString = env.NODE_ENV === 'test' ? env.TEST_DATABASE_URL : env.DATABASE_URL;

const conn = globalForDb.conn ?? new Pool({ connectionString });
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
