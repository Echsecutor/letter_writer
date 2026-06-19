import { NotImplementedError, PHASE_1 } from '../../domain/notImplemented';
import { stubArg } from '../../domain/stubArg';
import type { LetterContext } from '../../domain/letter/types';

export interface FillTemplateInput {
  shell: string;
  context: LetterContext;
}

export interface FillTemplateOutput {
  filledShell: string;
}

export function fillTemplate(input: FillTemplateInput): FillTemplateOutput {
  stubArg(input);
  throw new NotImplementedError(PHASE_1, 'fillTemplate');
}
