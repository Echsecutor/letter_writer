import { NotImplementedError, PHASE_1 } from '../../domain/notImplemented';
import { stubArg } from '../../domain/stubArg';
import type { CompileResult } from '../../domain/letter/types';

export interface CompileTypstInput {
  mainContent: string;
}

export interface TypstCompiler {
  compile(input: CompileTypstInput): Promise<CompileResult>;
}

export function compileTypst(
  input: CompileTypstInput,
  compiler?: TypstCompiler,
): Promise<CompileResult> {
  stubArg(input, compiler);
  return Promise.reject(new NotImplementedError(PHASE_1, 'compileTypst'));
}
