import { NotImplementedError, PHASE_2 } from '../../domain/notImplemented';
import { stubArg } from '../../domain/stubArg';
import type { BodyMode } from '../../domain/letter/types';

export interface ConvertBodyInput {
  body: string;
  mode: BodyMode;
}

export interface ConvertBodyOutput {
  bodyTypst: string;
}

export function convertBody(input: ConvertBodyInput): Promise<ConvertBodyOutput> {
  stubArg(input);
  return Promise.reject(new NotImplementedError(PHASE_2, 'convertBody'));
}
