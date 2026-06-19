import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from './AppLayout';
import { loadTemplate } from '../domain/templates/loadTemplate';
import type { LetterSchema } from '../domain/templates/schemaTypes';
import { useDraftPersistence } from '../hooks/useDraftPersistence';
import { useLetterPipeline } from '../hooks/useLetterPipeline';
import { DownloadButton } from '../ui/DownloadButton';
import { LetterForm } from '../ui/LetterForm';
import { TemplatePicker } from '../ui/TemplatePicker';
import { TypstPreview } from '../ui/TypstPreview';

const DEFAULT_TEMPLATE_ID = 'letter';

export function App() {
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [schema, setSchema] = useState<LetterSchema | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { values, setField, resetForTemplate } = useDraftPersistence(templateId);

  useEffect(() => {
    let cancelled = false;
    void loadTemplate(templateId)
      .then((template) => {
        if (!cancelled) {
          setSchema(template.schema);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSchema(null);
          setLoadError(error instanceof Error ? error.message : 'Template load failed');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  const pipelineInput = useMemo(() => {
    if (!schema) {
      return null;
    }
    return {
      templateId,
      values,
      bodyMode: 'plain' as const,
    };
  }, [schema, templateId, values]);

  const { output, loading, error } = useLetterPipeline(pipelineInput);

  const handleDownload = () => {
    if (!output?.compile.pdf) {
      return;
    }
    const blob = new Blob([new Uint8Array(output.compile.pdf)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${templateId}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <TemplatePicker
            templates={[{ id: DEFAULT_TEMPLATE_ID, title: schema?.title ?? 'Standardbrief' }]}
            selectedId={templateId}
            onSelect={(nextTemplateId) => {
              setTemplateId(nextTemplateId);
              resetForTemplate(nextTemplateId);
            }}
          />
          {loadError ? (
            <p className="text-sm text-red-700">{loadError}</p>
          ) : (
            <LetterForm
              fields={schema?.fields ?? []}
              values={values}
              onChange={setField}
            />
          )}
          <DownloadButton
            disabled={!output?.compile.pdf || loading}
            label="PDF herunterladen"
            onDownload={handleDownload}
          />
        </section>
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <TypstPreview svg={output?.compile.svg ?? null} loading={loading} error={error} />
        </section>
      </div>
    </AppLayout>
  );
}
