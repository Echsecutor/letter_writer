import type { SchemaField } from '../domain/templates/schemaTypes';
import type { FormValues } from '../domain/letter/types';

export interface LetterFormProps {
  fields: SchemaField[];
  values: FormValues;
  onChange: (fieldId: string, value: string) => void;
}

export function LetterForm({ fields, values, onChange }: LetterFormProps) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        Formularfelder erscheinen, sobald eine Vorlage geladen ist.
      </p>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="mb-1 block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              rows={6}
              value={values[field.id] ?? field.default ?? ''}
              placeholder={field.placeholder}
              onChange={(event) => {
                onChange(field.id, event.target.value);
              }}
            />
          ) : (
            <input
              id={field.id}
              type={field.type === 'date' ? 'date' : 'text'}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={values[field.id] ?? field.default ?? ''}
              placeholder={field.placeholder}
              onChange={(event) => {
                onChange(field.id, event.target.value);
              }}
            />
          )}
        </div>
      ))}
    </form>
  );
}
