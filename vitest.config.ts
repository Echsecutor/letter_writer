import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@/domain/templates/loadTemplate',
        replacement: path.resolve(rootDir, 'src/domain/templates/loadTemplate.node.ts'),
      },
      {
        find: '@',
        replacement: path.resolve(rootDir, 'src'),
      },
    ],
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
