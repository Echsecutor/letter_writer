import type { LoadedTemplate, LetterSchema } from './schemaTypes';
import { resolveLetterSchema } from './resolveSchema';
import { appUrl } from '@/infra/appUrl';

export function loadTemplate(templateId: string): Promise<LoadedTemplate> {
  const schemaSource = {
    readJson: async (relativePath: string) => {
      const response = await fetch(appUrl(`templates/${relativePath}`));
      if (!response.ok) {
        throw new Error(`Failed to load schema "${relativePath}"`);
      }
      return response.json() as Promise<unknown>;
    },
  };

  return Promise.all([
    fetch(appUrl(`templates/${templateId}.typ`)),
    fetch(appUrl(`templates/${templateId}.schema.json`)),
  ]).then(async ([shellRes, schemaRes]) => {
    if (!shellRes.ok || !schemaRes.ok) {
      throw new Error(`Failed to load template "${templateId}"`);
    }

    const [shell, schemaRaw] = await Promise.all([
      shellRes.text(),
      schemaRes.json() as Promise<LetterSchema>,
    ]);
    const schema = await resolveLetterSchema(schemaRaw, schemaSource);

    return {
      id: templateId,
      shell,
      schema,
    };
  });
}
