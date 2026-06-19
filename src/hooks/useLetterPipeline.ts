import { NotImplementedError, PHASE_1 } from '../domain/notImplemented';
import { stubArg } from '../domain/stubArg';
import type { LetterInput, LetterOutput } from '../domain/letter/types';

export interface UseLetterPipelineResult {
  output: LetterOutput | null;
  loading: boolean;
  error: string | null;
}

export function useLetterPipeline(input: LetterInput | null): UseLetterPipelineResult {
  stubArg(input);
  throw new NotImplementedError(PHASE_1, 'useLetterPipeline');
}
