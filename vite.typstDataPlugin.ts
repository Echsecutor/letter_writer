import { existsSync, mkdirSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

export function typstDataPlugin(rootDir: string): Plugin {
  const typstDataDir = path.join(rootDir, 'public/typst-data');
  const packagesDir = path.join(typstDataDir, 'typst/packages/local');
  const letterProLink = path.join(packagesDir, 'letter-pro');
  const letterProTarget = path.join(rootDir, 'public/typst-packages/local/letter-pro');

  return {
    name: 'letter-writer-typst-data',
    buildStart() {
      mkdirSync(packagesDir, { recursive: true });
      if (existsSync(letterProLink)) {
        return;
      }
      symlinkSync(letterProTarget, letterProLink, 'dir');
    },
  };
}
