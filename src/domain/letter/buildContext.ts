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

function splitAddressLines(address: string): string[] {
  const byNewline = address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (byNewline.length > 1) {
    return byNewline;
  }

  return address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function toSenderLines(name: string, address: string): string[] {
  return [name, ...splitAddressLines(address)].map((line) => typstEscape(line));
}

function toAddressTypstArray(address: string): string {
  return splitAddressLines(address)
    .map((line) => `"${typstEscape(line)}"`)
    .join(', ');
}

function parseGermanDate(value: string): { day: number; month: number; year: number } | null {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }
  return { day, month, year };
}

function toDatumDatetimeTypst(datum: string): string {
  const parsed = parseGermanDate(datum);
  if (!parsed) {
    return '';
  }
  return `datetime(day: ${String(parsed.day)}, month: ${String(parsed.month)}, year: ${String(parsed.year)})`;
}

export function parseReferenceSigns(raw: string | undefined): ReferenceSign[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry): entry is ReferenceSign =>
          typeof entry === 'object' &&
          entry !== null &&
          typeof (entry as ReferenceSign).label === 'string' &&
          typeof (entry as ReferenceSign).value === 'string',
      )
      .map((entry) => ({
        label: entry.label.trim(),
        value: entry.value.trim(),
      }))
      .filter((entry) => entry.label !== '' || entry.value !== '');
  } catch {
    return [];
  }
}

function escapeReferenceSigns(signs: ReferenceSign[]): ReferenceSign[] {
  return signs.map((sign) => ({
    label: typstEscape(sign.label),
    value: typstEscape(sign.value),
  }));
}

function toBriefsInformationExtra(signs: ReferenceSign[]): string {
  if (signs.length === 0) {
    return '';
  }

  return signs
    .map((sign) => {
      if (sign.label && sign.value) {
        return `${typstEscape(sign.label)}: ${typstEscape(sign.value)}`;
      }
      return typstEscape(sign.label || sign.value);
    })
    .join('\\\\ ');
}

function toPcLetterReference(signs: ReferenceSign[]): string {
  if (signs.length === 0) {
    return '';
  }
  const first = signs[0];
  if (first.label && first.value) {
    return `${typstEscape(first.label)}: ${typstEscape(first.value)}`;
  }
  return typstEscape(first.label || first.value);
}

export function buildContext(input: BuildContextInput): LetterContext {
  const resolved = resolveFieldValues(input.values, input.schema);
  const today_de = formatTodayDe();
  const reference_signs = escapeReferenceSigns(parseReferenceSigns(input.values.reference_signs));
  const absenderName = typstEscape(resolved.Absender_Name);
  const absenderAdresse = typstEscape(resolved.Absender_Adresse);

  return {
    Absender_Name: absenderName,
    Absender_Adresse: absenderAdresse,
    Absender_sender_lines: toSenderLines(resolved.Absender_Name, resolved.Absender_Adresse),
    Absender_Adresse_typst_array: toAddressTypstArray(resolved.Absender_Adresse),
    Empfaenger: resolved.Empfaenger,
    Empfaenger_typst: toEmpfaengerTypst(resolved.Empfaenger),
    Betreff: typstEscape(resolved.Betreff),
    Datum: resolved.Datum ? typstEscape(resolved.Datum) : '',
    Datum_datetime_typst: resolved.Datum ? toDatumDatetimeTypst(resolved.Datum) : '',
    Ort: resolved.Ort ? typstEscape(resolved.Ort) : '',
    Anschreiben: resolved.Anschreiben,
    reference_signs,
    briefs_information_extra_typst: toBriefsInformationExtra(reference_signs),
    pc_letter_reference_typst: toPcLetterReference(reference_signs),
    today_de: typstEscape(today_de),
  };
}
