import { pgGenerate } from 'drizzle-dbml-generator';

import * as schema from '~/server/db/schema';

pgGenerate({ out: './schema.dbml', schema });
