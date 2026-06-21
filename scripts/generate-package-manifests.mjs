#!/usr/bin/env node
/** Writes .package-manifest.json for each vendored Typst package (browser worker file list). */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagesRoot = path.join(repoRoot, 'public/typst-packages/local');

const CATALOG = [
  ['letter-pro', '3.0.0'],
  ['briefs', '0.3.0'],
  ['pc-letter', '0.4.0'],
];

const MANIFEST_NAME = '.package-manifest.json';

function shouldSkipPackageEntry(name) {
  if (name === '.git') {
    return true;
  }
  // VCS/metadata dotfiles are vendored with upstream packages but not needed by Typst.
  if (name.startsWith('.')) {
    return true;
  }
  return false;
}

function walkFiles(dir, relativeBase = '') {
  const files = [];
  for (const name of readdirSync(dir)) {
    if (shouldSkipPackageEntry(name)) {
      continue;
    }
    const absolutePath = path.join(dir, name);
    const relativePath = relativeBase ? `${relativeBase}/${name}` : name;
    if (statSync(absolutePath).isDirectory()) {
      files.push(...walkFiles(absolutePath, relativePath));
      continue;
    }
    files.push(relativePath);
  }
  return files.sort();
}

for (const [name, version] of CATALOG) {
  const packageRoot = path.join(packagesRoot, name, version);
  const manifestPath = path.join(packageRoot, MANIFEST_NAME);
  const files = walkFiles(packageRoot);
  writeFileSync(manifestPath, `${JSON.stringify(files, null, 2)}\n`);
  console.log(`Wrote ${files.length} paths to ${manifestPath}`);
}
