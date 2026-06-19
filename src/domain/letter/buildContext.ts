import type { FormValues, LetterContext, ReferenceSign, ReferenceSignDisplay } from './types';
import type { LetterSchema } from '../templates/schemaTypes';
import {
  formatDateDe,
  formatOrtDateLine,
  formatTodayDe,
  toDatumDatetimeTypst,
} from './dateFormat';
import {
  buildSignatureTypst,
  parseSignatureDataUrl,
  signatureShadowPath,
} from './signatureAsset';
import { typstEscape } from './typstEscape';

export interface BuildContextInput {
  values: FormValues;
  schema: LetterSchema;
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
      .filter((entry) => entry.value !== '');
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

function toLetterProReferenceSigns(signs: ReferenceSign[]): ReferenceSignDisplay[] {
  return signs
    .filter((sign) => sign.value !== '')
    .map((sign) => {
      const label = sign.label || 'Bezug';
      return { display: typstEscape(`${label}: ${sign.value}`) };
    });
}

function toBriefsInformationExtra(signs: ReferenceSign[]): string {
  const withValues = signs.filter((sign) => sign.value !== '');
  if (withValues.length === 0) {
    return '';
  }

  return withValues
    .map((sign) => {
      if (sign.label) {
        return `${typstEscape(sign.label)}: ${typstEscape(sign.value)}`;
      }
      return typstEscape(sign.value);
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
  const todayDe = formatTodayDe();
  const reference_signs = escapeReferenceSigns(parseReferenceSigns(input.values.reference_signs));
  const absenderName = typstEscape(resolved.Absender_Name);
  const absenderAdresse = typstEscape(resolved.Absender_Adresse);
  const ortRaw = resolved.Ort;
  const datumDe = resolved.Datum ? formatDateDe(resolved.Datum) : '';
  const todayOrtLine = typstEscape(formatOrtDateLine(ortRaw, todayDe));
  const datumOrtLine = datumDe
    ? typstEscape(formatOrtDateLine(ortRaw, datumDe))
    : todayOrtLine;
  const signaturePath = signatureShadowPath(input.values.Unterschrift);
  const signatureAsset = parseSignatureDataUrl(input.values.Unterschrift);

  return {
    Absender_Name: absenderName,
    Absender_Adresse: absenderAdresse,
    Absender_sender_lines: toSenderLines(resolved.Absender_Name, resolved.Absender_Adresse),
    Absender_Adresse_typst_array: toAddressTypstArray(resolved.Absender_Adresse),
    Empfaenger: resolved.Empfaenger,
    Empfaenger_typst: toEmpfaengerTypst(resolved.Empfaenger),
    Betreff: typstEscape(resolved.Betreff),
    Datum: datumDe ? typstEscape(datumDe) : '',
    Datum_de: datumDe ? typstEscape(datumDe) : '',
    Datum_ort_line: datumOrtLine,
    Datum_datetime_typst: resolved.Datum ? toDatumDatetimeTypst(resolved.Datum) : '',
    Ort: ortRaw ? typstEscape(ortRaw) : '',
    Anschreiben: resolved.Anschreiben,
    reference_signs,
    letter_pro_reference_signs: toLetterProReferenceSigns(reference_signs),
    briefs_information_extra_typst: toBriefsInformationExtra(reference_signs),
    pc_letter_reference_typst: toPcLetterReference(reference_signs),
    today_de: typstEscape(todayDe),
    today_ort_line: todayOrtLine,
    signature_typst:
      signatureAsset && signaturePath ? buildSignatureTypst(signaturePath) : '',
  };
}

export function extractSignatureAsset(values: FormValues): ReturnType<typeof parseSignatureDataUrl> {
  return parseSignatureDataUrl(values.Unterschrift);
}
