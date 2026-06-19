export interface ReferenceSign {
  label: string;
  value: string;
}

/** Form values merged with computed Typst-ready fields for Nunjucks. */
export interface LetterContext {
  Absender_Name: string;
  Absender_Adresse: string;
  Absender_sender_lines: string[];
  Absender_Adresse_typst_array: string;
  Empfaenger: string;
  Empfaenger_typst: string;
  Betreff: string;
  Datum: string;
  Datum_datetime_typst: string;
  Ort: string;
  Anschreiben: string;
  reference_signs: ReferenceSign[];
  briefs_information_extra_typst: string;
  pc_letter_reference_typst: string;
  today_de: string;
  [key: string]: string | ReferenceSign[] | string[];
}

export interface FormValues {
  [fieldId: string]: string | undefined;
}

export type BodyMode = 'plain' | 'markdown';

export interface LetterInput {
  templateId: string;
  values: FormValues;
  bodyMode: BodyMode;
}

export interface CompileResult {
  svg: string;
  pdf: Uint8Array;
}

export interface LetterOutput {
  filledShell: string;
  mainContent: string;
  compile: CompileResult;
}

export const LEGACY_TEMPLATE_ID = 'letter';
export const DEFAULT_TEMPLATE_ID = 'letter-pro';

export function normalizeTemplateId(templateId: string): string {
  return templateId === LEGACY_TEMPLATE_ID ? DEFAULT_TEMPLATE_ID : templateId;
}
