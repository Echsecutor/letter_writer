import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from './AppLayout';
import { DEFAULT_TEMPLATE_ID } from '../domain/letter/types';
import { loadCatalog } from '../domain/templates/loadCatalog';
import { loadTemplate } from '../domain/templates/loadTemplate';
import type { LetterSchema, TemplateCatalogEntry } from '../domain/templates/schemaTypes';
import { useDraftPersistence } from '../hooks/useDraftPersistence';
import { useLetterPipeline } from '../hooks/useLetterPipeline';
import { BodyModeToggle } from '../ui/BodyModeToggle';
import { DownloadButton } from '../ui/DownloadButton';
import { LetterForm } from '../ui/LetterForm';
import { ReferenceFields } from '../ui/ReferenceFields';
import { TemplatePicker } from '../ui/TemplatePicker';
import { TypstPreview } from '../ui/TypstPreview';

export function App() {
  const { templateId, values, bodyMode, setTemplateId, setField, setBodyMode } =
    useDraftPersistence();
  const [catalog, setCatalog] = useState<TemplateCatalogEntry[]>([]);
  const [schema, setSchema] = useState<LetterSchema | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadCatalog()
      .then((entries) => {
        if (!cancelled) {
          setCatalog(entries);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Catalog load failed');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      bodyMode,
    };
  }, [schema, templateId, values, bodyMode]);

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

  const catalogEntries =
    catalog.length > 0
      ? catalog
      : [{ id: DEFAULT_TEMPLATE_ID, title: 'Standardbrief', description: '', package: '' }];

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <TemplatePicker
            templates={catalogEntries}
            selectedId={templateId}
            onSelect={setTemplateId}
          />
          {loadError ? (
            <p className="text-sm text-red-700">{loadError}</p>
          ) : (
            <>
              <BodyModeToggle mode={bodyMode} onChange={setBodyMode} />
              <LetterForm fields={schema?.fields ?? []} values={values} onChange={setField} />
              <ReferenceFields
                value={values.reference_signs}
                onChange={(nextValue) => {
                  setField('reference_signs', nextValue);
                }}
              />
            </>
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
