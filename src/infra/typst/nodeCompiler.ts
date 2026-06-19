import { NotImplementedError, PHASE_1 } from '../../domain/notImplemented';
import { stubArg } from '../../domain/stubArg';
import type { CompileResult } from '../../domain/letter/types';
import type { CompileTypstInput } from '../../pipeline/stages/compileTypst';

/** Node typst compiler adapter for CI integration tests (Phase 1). */
export function compileWithNodeCompiler(input: CompileTypstInput): Promise<CompileResult> {
  stubArg(input);
  return Promise.reject(new NotImplementedError(PHASE_1, 'nodeCompiler'));
}
