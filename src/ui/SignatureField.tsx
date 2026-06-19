export interface SignatureFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export function SignatureField({ value, onChange }: SignatureFieldProps) {
  return (
    <div className="space-y-2 rounded border border-gray-200 bg-white p-3">
      <label htmlFor="Unterschrift" className="block text-sm font-medium text-gray-700">
        Unterschrift (Bild)
      </label>
      <input
        id="Unterschrift"
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border file:border-gray-300 file:bg-white file:px-3 file:py-1 file:text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              onChange(reader.result);
            }
          };
          reader.readAsDataURL(file);
          event.target.value = '';
        }}
      />
      {value ? (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Unterschrift Vorschau"
            className="max-h-16 max-w-[12rem] rounded border border-gray-200 bg-white object-contain p-1"
          />
          <button
            type="button"
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => {
              onChange('');
            }}
          >
            Entfernen
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-500">PNG, JPEG, SVG oder WebP unter dem Schlusssatz einfügen.</p>
      )}
    </div>
  );
}
