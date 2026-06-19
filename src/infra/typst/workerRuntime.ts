import {
  CompileFormatEnum,
  createTypstCompiler,
  type TypstCompiler,
} from '@myriaddreamin/typst.ts/compiler';
import { MemoryAccessModel } from '@myriaddreamin/typst.ts';
import {
  preloadFontAssets,
  withAccessModel,
  withPackageRegistry,
} from '@myriaddreamin/typst.ts/options.init';
import { createTypstRenderer, type TypstRenderer } from '@myriaddreamin/typst.ts/renderer';
import type { CompileResult } from '../../domain/letter/types';
import {
  createLocalLetterProRegistry,
  registerLetterProFiles,
} from './letterProPackage';
import { letterProPackageUrlBase } from './letterProPaths';

const MAIN_FILE = '/main.typ';

let compilerPromise: Promise<TypstCompiler> | null = null;
let rendererPromise: Promise<TypstRenderer> | null = null;

async function loadAllPackageFiles(): Promise<Array<{ relativePath: string; content: Uint8Array }>> {
  const manifestRes = await fetch(`${letterProPackageUrlBase()}/typst.toml`);
  const libRes = await fetch(`${letterProPackageUrlBase()}/src/lib.typ`);

  if (!manifestRes.ok || !libRes.ok) {
    throw new Error('Failed to load vendored letter-pro package');
  }

  return [
    { relativePath: 'typst.toml', content: new Uint8Array(await manifestRes.arrayBuffer()) },
    { relativePath: 'src/lib.typ', content: new Uint8Array(await libRes.arrayBuffer()) },
  ];
}

async function createCompiler(): Promise<TypstCompiler> {
  const accessModel = new MemoryAccessModel();
  registerLetterProFiles(accessModel, await loadAllPackageFiles());

  const compiler = createTypstCompiler();
  await compiler.init({
    beforeBuild: [
      withAccessModel(accessModel),
      withPackageRegistry(createLocalLetterProRegistry()),
      preloadFontAssets({ assets: ['text'] }),
    ],
  });

  return compiler;
}

async function createRenderer(): Promise<TypstRenderer> {
  const renderer = createTypstRenderer();
  await renderer.init({ beforeBuild: [] });
  return renderer;
}

async function getCompiler(): Promise<TypstCompiler> {
  compilerPromise ??= createCompiler();
  return compilerPromise;
}

function getRenderer(): Promise<TypstRenderer> {
  rendererPromise ??= createRenderer();
  return rendererPromise;
}

export async function compileTypstInWorkerRuntime(mainContent: string): Promise<CompileResult> {
  const compiler = await getCompiler();
  const renderer = await getRenderer();

  compiler.resetShadow();
  compiler.addSource(MAIN_FILE, mainContent);

  const vectorResult = await compiler.compile({
    mainFilePath: MAIN_FILE,
    format: CompileFormatEnum.vector,
  });

  if (!vectorResult.result) {
    const message = vectorResult.diagnostics?.map((item) => JSON.stringify(item)).join('\n');
    throw new Error(message || 'Typst compilation failed');
  }

  const pdfResult = await compiler.compile({
    mainFilePath: MAIN_FILE,
    format: CompileFormatEnum.pdf,
  });

  if (!pdfResult.result) {
    const message = pdfResult.diagnostics?.map((item) => JSON.stringify(item)).join('\n');
    throw new Error(message || 'Typst PDF export failed');
  }

  const svg = await renderer.renderSvg({
    format: 'vector',
    artifactContent: vectorResult.result,
  });

  return {
    svg,
    pdf: pdfResult.result,
  };
}

export async function initTypstWorkerRuntime(): Promise<void> {
  await getCompiler();
  await getRenderer();
}
