export interface TypstShadowFile {
  path: string;
  content: Uint8Array;
}

const DATA_URL_PATTERN = /^data:([^;]+);base64,(.+)$/;

function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/svg+xml':
      return 'svg';
    case 'image/webp':
      return 'webp';
    default:
      return 'png';
  }
}

export function signatureShadowPath(dataUrl: string | undefined): string {
  if (!dataUrl?.startsWith('data:image/')) {
    return '';
  }

  const mime = dataUrl.slice('data:'.length).split(';')[0] ?? 'image/png';
  return `/assets/signature.${extensionForMime(mime)}`;
}

export function parseSignatureDataUrl(dataUrl: string | undefined): TypstShadowFile | null {
  if (!dataUrl) {
    return null;
  }

  const match = DATA_URL_PATTERN.exec(dataUrl);
  if (!match) {
    return null;
  }

  const mime = match[1];
  const base64 = match[2];
  const path = `/assets/signature.${extensionForMime(mime)}`;
  const binary = atob(base64);
  const content = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return { path, content };
}

export function buildSignatureTypst(imagePath: string): string {
  return `#v(0.8cm)\n#image("${imagePath}", width: 4cm)`;
}
