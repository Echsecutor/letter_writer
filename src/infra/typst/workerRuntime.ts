import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';
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
import type { TypstShadowFile } from '../../domain/letter/signatureAsset';
import {
  CATALOG_PACKAGES,
  createLocalPackageRegistry,
  registerPackageFiles,
  type CatalogPackage,
} from './localTypstPackages';
import { localPackageUrlBase } from './localPackagePaths';

const MAIN_FILE = '/main.typ';

let compilerPromise: Promise<TypstCompiler> | null = null;
let rendererPromise: Promise<TypstRenderer> | null = null;

async function loadPackageFilesFromManifest(
  spec: CatalogPackage,
): Promise<Array<{ relativePath: string; content: Uint8Array }>> {
  const base = localPackageUrlBase(spec);
  const manifestRes = await fetch(`${base}/package-manifest.json`);
  if (!manifestRes.ok) {
    throw new Error(`Failed to load package manifest for ${spec.name}@${spec.version}`);
  }

  const paths = (await manifestRes.json()) as string[];
  return Promise.all(
    paths.map(async (relativePath) => {
      const fileRes = await fetch(`${base}/${relativePath}`);
      if (!fileRes.ok) {
        throw new Error(`Failed to load ${spec.name} file ${relativePath}`);
      }
      return {
        relativePath,
        content: new Uint8Array(await fileRes.arrayBuffer()),
      };
    }),
  );
}

async function createCompiler(): Promise<TypstCompiler> {
  const accessModel = new MemoryAccessModel();

  for (const spec of CATALOG_PACKAGES) {
    registerPackageFiles(accessModel, spec, await loadPackageFilesFromManifest(spec));
  }

  const compiler = createTypstCompiler();
  await compiler.init({
    getModule: () => compilerWasmUrl,
    beforeBuild: [
      withAccessModel(accessModel),
      withPackageRegistry(createLocalPackageRegistry()),
      preloadFontAssets({ assets: ['text'] }),
    ],
  });

  return compiler;
}

async function createRenderer(): Promise<TypstRenderer> {
  const renderer = createTypstRenderer();
  await renderer.init({
    getModule: () => rendererWasmUrl,
    beforeBuild: [],
  });
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

export async function compileTypstInWorkerRuntime(
  mainContent: string,
  shadowFiles: TypstShadowFile[] = [],
): Promise<CompileResult> {
  const compiler = await getCompiler();
  const renderer = await getRenderer();

  compiler.resetShadow();
  compiler.addSource(MAIN_FILE, mainContent);
  for (const file of shadowFiles) {
    compiler.mapShadow(file.path, file.content);
  }

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
