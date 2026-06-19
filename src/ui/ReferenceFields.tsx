import { useState } from 'react';
import type { ReferenceSign } from '../domain/letter/types';
import { parseReferenceSigns } from '../domain/letter/buildContext';

export interface ReferenceFieldsProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const STANDARD_ROWS: ReferenceSign[] = [
  { label: 'Ihr Zeichen', value: '' },
  { label: 'Unser Zeichen', value: '' },
];

const EMPTY_ROW: ReferenceSign = { label: '', value: '' };

function readRows(value: string | undefined): ReferenceSign[] {
  const parsed = parseReferenceSigns(value);
  const standardByLabel = new Map(
    STANDARD_ROWS.map((row) => [row.label, { ...row, value: '' }]),
  );
  const customRows: ReferenceSign[] = [];

  for (const row of parsed) {
    const standard = standardByLabel.get(row.label);
    if (standard) {
      standard.value = row.value;
      continue;
    }
    customRows.push({ ...row });
  }

  return [...standardByLabel.values(), ...customRows];
}

function serializeRows(rows: ReferenceSign[]): string {
  const filtered = rows.filter((row) => row.value.trim() !== '');
  return filtered.length > 0 ? JSON.stringify(filtered) : '';
}

function isStandardRow(index: number): boolean {
  return index < STANDARD_ROWS.length;
}

export function ReferenceFields({ value, onChange }: ReferenceFieldsProps) {
  const rows = readRows(value);
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(() => new Set());

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
    const row = rows[index];

    if (isStandardRow(index)) {
      setExpandedStandards((current) => {
        const next = new Set(current);
        next.delete(row.label);
        return next;
      });
      const next = rows.map((entry, rowIndex) =>
        rowIndex === index ? { ...entry, value: '' } : entry,
      );
      onChange(serializeRows(next));
      return;
    }

    onChange(serializeRows(rows.filter((_, rowIndex) => rowIndex !== index)));
  };

  const showStandardRow = (row: ReferenceSign): boolean =>
    row.value.trim() !== '' || expandedStandards.has(row.label);

  const hiddenStandardRows = rows.slice(0, STANDARD_ROWS.length).filter((row) => !showStandardRow(row));

  const addStandardRow = (label: string) => {
    setExpandedStandards((current) => new Set(current).add(label));
  };

  const visibleRows = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => !isStandardRow(index) || showStandardRow(row));

  return (
    <fieldset className="space-y-2 rounded border border-gray-200 bg-white p-3">
      <legend className="px-1 text-sm font-medium text-gray-700">Bezugszeichen</legend>
      {visibleRows.map(({ row, index }) => {
        const standard = isStandardRow(index);

        return (
          <div key={`${row.label}-${String(index)}`} className="grid grid-cols-[auto_1fr_auto] gap-2">
            {standard ? (
              <span className="self-center whitespace-nowrap text-sm text-gray-700">{row.label}:</span>
            ) : (
              <input
                aria-label={`Bezugszeichen Label ${String(index + 1)}`}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="Bezeichnung"
                value={row.label}
                onChange={(event) => {
                  updateRow(index, { label: event.target.value });
                }}
              />
            )}
            <input
              aria-label={`${row.label || 'Bezugszeichen'} Wert ${String(index + 1)}`}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Wert"
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
        );
      })}
      {hiddenStandardRows.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hiddenStandardRows.map((row) => (
            <button
              key={row.label}
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                addStandardRow(row.label);
              }}
            >
              {row.label} hinzufügen
            </button>
          ))}
        </div>
      ) : null}
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
