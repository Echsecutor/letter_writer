export type SchemaFieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'reference-signs';

export interface SchemaField {
  id: string;
  label: string;
  type: SchemaFieldType;
  required?: boolean;
  default?: string;
  placeholder?: string;
}

export interface LetterSchema {
  id: string;
  title: string;
  fields: SchemaField[];
}

export interface LoadedTemplate {
  id: string;
  shell: string;
  schema: LetterSchema;
}
