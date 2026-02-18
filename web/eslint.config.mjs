// @ts-check

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// @ts-expect-error -- no types for this plugin
import drizzle from 'eslint-plugin-drizzle';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      drizzle,
    },
    rules: {
      'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: ['db', 'ctx.db'] }],
      'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: ['db', 'ctx.db'] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
