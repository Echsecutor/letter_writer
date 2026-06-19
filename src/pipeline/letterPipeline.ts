import { NotImplementedError, PHASE_1 } from '../domain/notImplemented';
import { stubArg } from '../domain/stubArg';
import type { LetterInput, LetterOutput } from '../domain/letter/types';
import type { TypstCompiler } from './stages/compileTypst';

export interface LetterPipelineOptions {
  typstCompiler?: TypstCompiler;
}

export function runLetterPipeline(
  input: LetterInput,
  options?: LetterPipelineOptions,
): Promise<LetterOutput> {
  stubArg(input, options);
  return Promise.reject(new NotImplementedError(PHASE_1, 'letterPipeline'));
}
