import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    fileParallelism: false,
    globalSetup: ['./tests/setup/global-setup.ts'],
    setupFiles: ['./tests/setup/test-setup.ts'],
  },
});
