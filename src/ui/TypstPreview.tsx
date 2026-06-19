export interface TypstPreviewProps {
  svg: string | null;
  loading: boolean;
  error: string | null;
}

export function TypstPreview({ svg, loading, error }: TypstPreviewProps) {
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-gray-600">
        Vorschau wird erstellt…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-gray-600">
        Noch keine Vorschau.
      </div>
    );
  }

  return (
    <div
      className="overflow-auto rounded border border-gray-200 bg-white p-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
