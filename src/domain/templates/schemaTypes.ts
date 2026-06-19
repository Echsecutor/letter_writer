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
  extends?: string;
  description?: string;
  package?: string;
}

export interface TemplateCatalogEntry {
  id: string;
  title: string;
  description: string;
  package: string;
  preview?: string;
}

export interface TemplateCatalog {
  templates: TemplateCatalogEntry[];
}

export interface LoadedTemplate {
  id: string;
  shell: string;
  schema: LetterSchema;
}
