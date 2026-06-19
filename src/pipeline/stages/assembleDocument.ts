import { NotImplementedError, PHASE_1 } from '../../domain/notImplemented';
import { stubArg } from '../../domain/stubArg';

export const BODY_INJECT_MARKER = '/* BODY_INJECT */';

export interface AssembleDocumentInput {
  filledShell: string;
  bodyTypst: string;
}

export interface AssembleDocumentOutput {
  mainContent: string;
}

export function assembleDocument(input: AssembleDocumentInput): AssembleDocumentOutput {
  stubArg(input);
  throw new NotImplementedError(PHASE_1, 'assembleDocument');
}
