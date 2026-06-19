import type { CompileResult } from '../../domain/letter/types';
import type { TypstShadowFile } from '../../domain/letter/signatureAsset';

export interface CompileTypstInput {
  mainContent: string;
  shadowFiles?: TypstShadowFile[];
}

export interface TypstCompiler {
  compile(input: CompileTypstInput): Promise<CompileResult>;
}

export function compileTypst(
  input: CompileTypstInput,
  compiler: TypstCompiler,
): Promise<CompileResult> {
  return compiler.compile(input);
}
