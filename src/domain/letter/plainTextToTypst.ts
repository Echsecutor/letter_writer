import { NotImplementedError, PHASE_1 } from '../notImplemented';
import { stubArg } from '../stubArg';

export function plainTextToTypst(text: string): string {
  stubArg(text);
  throw new NotImplementedError(PHASE_1, 'plainTextToTypst');
}
