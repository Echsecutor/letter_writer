export interface DownloadButtonProps {
  label: string;
  disabled?: boolean;
  onDownload: () => void;
}

export function DownloadButton({ label, disabled = false, onDownload }: DownloadButtonProps) {
  return (
    <button
      type="button"
      className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      onClick={onDownload}
    >
      {label}
    </button>
  );
}
