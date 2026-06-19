import { NotImplementedError, PHASE_2 } from '../../domain/notImplemented';
import type { BodyConverter, BodyConverterFactory } from './types';

export function createPandocConverter(): BodyConverterFactory {
  throw new NotImplementedError(PHASE_2, 'pandocConverter');
}

export type { BodyConverter };
