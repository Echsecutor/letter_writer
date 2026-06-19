import { NotImplementedError, PHASE_1 } from '../notImplemented';
import { stubArg } from '../stubArg';
import type { FormValues, LetterContext } from './types';
import type { LetterSchema } from '../templates/schemaTypes';

export interface BuildContextInput {
  values: FormValues;
  schema: LetterSchema;
}

export function buildContext(input: BuildContextInput): LetterContext {
  stubArg(input);
  throw new NotImplementedError(PHASE_1, 'buildContext');
}
