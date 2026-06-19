export interface TemplateOption {
  id: string;
  title: string;
}

export interface TemplatePickerProps {
  templates: TemplateOption[];
  selectedId: string | null;
  onSelect: (templateId: string) => void;
}

export function TemplatePicker({ templates, selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div>
      <label htmlFor="template" className="mb-1 block text-sm font-medium text-gray-700">
        Vorlage
      </label>
      <select
        id="template"
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
        value={selectedId ?? ''}
        onChange={(event) => {
          onSelect(event.target.value);
        }}
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.title}
          </option>
        ))}
      </select>
    </div>
  );
}
