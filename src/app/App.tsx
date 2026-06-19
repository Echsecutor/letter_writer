import { AppLayout } from './AppLayout';
import { TemplatePicker } from '../ui/TemplatePicker';
import { LetterForm } from '../ui/LetterForm';
import { TypstPreview } from '../ui/TypstPreview';
import { DownloadButton } from '../ui/DownloadButton';

export function App() {
  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <TemplatePicker
            templates={[{ id: 'letter', title: 'Standardbrief' }]}
            selectedId="letter"
            onSelect={() => undefined}
          />
          <LetterForm fields={[]} values={{}} onChange={() => undefined} />
          <DownloadButton disabled label="PDF herunterladen" onDownload={() => undefined} />
        </section>
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <TypstPreview svg={null} loading={false} error={null} />
        </section>
      </div>
    </AppLayout>
  );
}
