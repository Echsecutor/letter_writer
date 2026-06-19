import { NotImplementedError, PHASE_2 } from '../../domain/notImplemented';
import type { BodyConverterFactory } from './types';

export function createMarkdown2TypstConverter(): BodyConverterFactory {
  throw new NotImplementedError(PHASE_2, 'markdown2typstConverter');
}
