import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type Pool as PgPool } from 'pg';

import * as schema from '~/server/db/schema';
import { env } from '~/env';

const globalForDb = globalThis as unknown as { conn: PgPool | undefined };

const conn = globalForDb.conn ?? new Pool({ connectionString: env.DATABASE_URL });
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
