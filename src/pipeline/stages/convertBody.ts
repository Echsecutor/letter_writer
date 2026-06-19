import { plainTextToTypst } from '../../domain/letter/plainTextToTypst';
import type { BodyMode } from '../../domain/letter/types';
import type { BodyConverter } from '../bodyConverters/types';

export interface ConvertBodyInput {
  body: string;
  mode: BodyMode;
}

export interface ConvertBodyOutput {
  bodyTypst: string;
}

export interface ConvertBodyOptions {
  converter?: BodyConverter;
}

export async function convertBody(
  input: ConvertBodyInput,
  options: ConvertBodyOptions = {},
): Promise<ConvertBodyOutput> {
  if (input.mode === 'plain' || !input.body.trim()) {
    return { bodyTypst: plainTextToTypst(input.body) };
  }

  if (!options.converter) {
    throw new Error('Markdown body conversion requires a BodyConverter');
  }

  const bodyTypst = await options.converter.convert(input.body);
  return { bodyTypst };
}
