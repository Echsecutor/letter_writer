import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CatalogPackage } from './localTypstPackages';

export interface PackageFile {
  relativePath: string;
  content: Uint8Array;
}

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

function walkPackageDir(dir: string, relativeBase = ''): PackageFile[] {
  const files: PackageFile[] = [];

  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'package-manifest.json') {
      continue;
    }

    const absolutePath = path.join(dir, name);
    const relativePath = relativeBase ? `${relativeBase}/${name}` : name;

    if (statSync(absolutePath).isDirectory()) {
      files.push(...walkPackageDir(absolutePath, relativePath));
      continue;
    }

    files.push({
      relativePath,
      content: readFileSync(absolutePath),
    });
  }

  return files;
}

export function loadLocalPackageFiles(spec: Pick<CatalogPackage, 'name' | 'version'>): PackageFile[] {
  const packageRoot = path.join(
    repoRoot,
    'public/typst-packages/local',
    spec.name,
    spec.version,
  );
  return walkPackageDir(packageRoot);
}
