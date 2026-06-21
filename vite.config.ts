import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { templatesPlugin } from './vite.templatesPlugin';
import { typstDataPlugin } from './vite.typstDataPlugin';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), templatesPlugin(rootDir), typstDataPlugin(rootDir)],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  assetsInclude: ['**/*.wasm'],
  worker: {
    format: 'es',
  },
});
