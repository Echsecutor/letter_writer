import type { BodyMode } from '../domain/letter/types';

export interface BodyModeToggleProps {
  mode: BodyMode;
  onChange: (mode: BodyMode) => void;
}

export function BodyModeToggle({ mode, onChange }: BodyModeToggleProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-700">Anschreiben-Format</legend>
      <div className="flex gap-4 text-sm text-gray-900">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="body-mode"
            value="plain"
            checked={mode === 'plain'}
            onChange={() => {
              onChange('plain');
            }}
          />
          Fließtext
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="body-mode"
            value="markdown"
            checked={mode === 'markdown'}
            onChange={() => {
              onChange('markdown');
            }}
          />
          Markdown
        </label>
      </div>
    </fieldset>
  );
}
