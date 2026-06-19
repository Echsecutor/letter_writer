import { NotImplementedError, PHASE_1 } from '../notImplemented';
import { stubArg } from '../stubArg';
import type { LoadedTemplate } from './schemaTypes';

export function loadTemplate(templateId: string): Promise<LoadedTemplate> {
  stubArg(templateId);
  return Promise.reject(new NotImplementedError(PHASE_1, 'loadTemplate'));
}
