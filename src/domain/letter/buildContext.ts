import type { FormValues, LetterContext, ReferenceSign } from './types';
import type { LetterSchema } from '../templates/schemaTypes';
import { typstEscape } from './typstEscape';

export interface BuildContextInput {
  values: FormValues;
  schema: LetterSchema;
}

function formatTodayDe(): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

function resolveFieldValues(values: FormValues, schema: LetterSchema): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const field of schema.fields) {
    const raw = values[field.id];
    resolved[field.id] = raw !== undefined && raw !== '' ? raw : (field.default ?? '');
  }
  return resolved;
}

function toEmpfaengerTypst(recipient: string): string {
  return recipient
    .split('\n')
    .map((line) => typstEscape(line.trim()))
    .filter(Boolean)
    .join('\\ ');
}

function escapeReferenceSigns(signs: ReferenceSign[]): ReferenceSign[] {
  return signs.map((sign) => ({
    label: typstEscape(sign.label),
    value: typstEscape(sign.value),
  }));
}

export function buildContext(input: BuildContextInput): LetterContext {
  const resolved = resolveFieldValues(input.values, input.schema);
  const today_de = formatTodayDe();
  const reference_signs = escapeReferenceSigns([]);

  return {
    Absender_Name: typstEscape(resolved.Absender_Name),
    Absender_Adresse: typstEscape(resolved.Absender_Adresse),
    Empfaenger: resolved.Empfaenger,
    Empfaenger_typst: toEmpfaengerTypst(resolved.Empfaenger),
    Betreff: typstEscape(resolved.Betreff),
    Datum: resolved.Datum ? typstEscape(resolved.Datum) : '',
    Anschreiben: resolved.Anschreiben,
    reference_signs,
    today_de: typstEscape(today_de),
  };
}
