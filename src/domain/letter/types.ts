export interface ReferenceSign {
  label: string;
  value: string;
}

/** Form values merged with computed Typst-ready fields for Nunjucks. */
export interface LetterContext {
  Absender_Name: string;
  Absender_Adresse: string;
  Empfaenger: string;
  Empfaenger_typst: string;
  Betreff: string;
  Datum: string;
  Anschreiben: string;
  reference_signs: ReferenceSign[];
  today_de: string;
  [key: string]: string | ReferenceSign[];
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
