import type { ReferenceSign } from '../domain/letter/types';
import { parseReferenceSigns } from '../domain/letter/buildContext';

export interface ReferenceFieldsProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const EMPTY_ROW: ReferenceSign = { label: '', value: '' };

function readRows(value: string | undefined): ReferenceSign[] {
  const parsed = parseReferenceSigns(value);
  return parsed.length > 0 ? parsed : [{ ...EMPTY_ROW }];
}

function serializeRows(rows: ReferenceSign[]): string {
  const filtered = rows.filter((row) => row.label.trim() !== '' || row.value.trim() !== '');
  return filtered.length > 0 ? JSON.stringify(filtered) : '';
}

export function ReferenceFields({ value, onChange }: ReferenceFieldsProps) {
  const rows = readRows(value);

  const updateRow = (index: number, patch: Partial<ReferenceSign>) => {
    const next = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, ...patch } : row,
    );
    onChange(serializeRows(next));
  };

  const addRow = () => {
    onChange(serializeRows([...rows, { ...EMPTY_ROW }]));
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, rowIndex) => rowIndex !== index);
    onChange(serializeRows(next.length > 0 ? next : [{ ...EMPTY_ROW }]));
  };

  return (
    <fieldset className="space-y-2 rounded border border-gray-200 bg-white p-3">
      <legend className="px-1 text-sm font-medium text-gray-700">Bezugszeichen</legend>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input
            aria-label={`Bezugszeichen Label ${String(index + 1)}`}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="Ihr Zeichen"
            value={row.label}
            onChange={(event) => {
              updateRow(index, { label: event.target.value });
            }}
          />
          <input
            aria-label={`Bezugszeichen Wert ${String(index + 1)}`}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="Unser Zeichen"
            value={row.value}
            onChange={(event) => {
              updateRow(index, { value: event.target.value });
            }}
          />
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => {
              removeRow(index);
            }}
          >
            Entfernen
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline"
        onClick={addRow}
      >
        Zeile hinzufügen
      </button>
    </fieldset>
  );
}
