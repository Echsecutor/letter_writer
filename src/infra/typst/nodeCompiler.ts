import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import type { CompileResult } from '../../domain/letter/types';
import type { CompileTypstInput, TypstCompiler } from '../../pipeline/stages/compileTypst';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

let sharedCompiler: NodeCompiler | null = null;

function ensureTypstPackageDataHome(): void {
  if (process.env.XDG_DATA_HOME) {
    return;
  }
  process.env.XDG_DATA_HOME = path.join(repoRoot, 'public/typst-data');
}

function getNodeCompiler(): NodeCompiler {
  ensureTypstPackageDataHome();
  sharedCompiler ??= NodeCompiler.create();
  return sharedCompiler;
}

/** Node typst compiler adapter for CI integration tests (Phase 1). */
export function compileWithNodeCompiler(input: CompileTypstInput): Promise<CompileResult> {
  const compiler = getNodeCompiler();
  compiler.resetShadow();
  for (const file of input.shadowFiles ?? []) {
    compiler.mapShadow(file.path, Buffer.from(file.content));
  }

  const compileArgs = { mainFileContent: input.mainContent };
  const pdf = compiler.pdf(compileArgs);
  const svg = compiler.svg(compileArgs);

  return Promise.resolve({
    pdf: new Uint8Array(pdf),
    svg,
  });
}

export const nodeTypstCompiler: TypstCompiler = {
  compile: compileWithNodeCompiler,
};
