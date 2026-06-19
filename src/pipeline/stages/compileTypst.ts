import type { CompileResult } from '../../domain/letter/types';

export interface CompileTypstInput {
  mainContent: string;
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
