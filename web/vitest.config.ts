import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, './tests/e2e/**'],
    fileParallelism: false,
    globalSetup: ['./tests/setup/global.setup.ts'],
    setupFiles: ['./tests/setup/test.setup.ts'],
  },
});
