import type { LetterSchema } from './schemaTypes';

export interface SchemaSource {
  readJson(relativePath: string): Promise<unknown>;
}

export async function resolveLetterSchema(
  raw: LetterSchema & { extends?: string },
  source: SchemaSource,
): Promise<LetterSchema> {
  if (!raw.extends) {
    return raw;
  }

  const sharedPath = raw.extends === 'shared' ? 'shared.schema.json' : `${raw.extends}.schema.json`;
  const sharedRaw = (await source.readJson(sharedPath)) as LetterSchema;
  const sharedFields = sharedRaw.fields;
  const overrideFields = raw.fields;

  const merged = new Map(sharedFields.map((field) => [field.id, field]));
  for (const field of overrideFields) {
    merged.set(field.id, field);
  }

  return {
    id: raw.id,
    title: raw.title,
    fields: [...merged.values()],
  };
}
