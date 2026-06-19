import { NotImplementedError, PHASE_1 } from '../domain/notImplemented';
import { stubArg } from '../domain/stubArg';
import type { FormValues } from '../domain/letter/types';

export interface DraftState {
  templateId: string;
  values: FormValues;
}

export function useDraftPersistence(templateId: string) {
  stubArg(templateId);
  throw new NotImplementedError(PHASE_1, 'useDraftPersistence');
}
