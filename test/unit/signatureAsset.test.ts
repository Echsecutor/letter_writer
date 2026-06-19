import { describe, expect, it } from 'vitest';
import {
  buildSignatureTypst,
  parseSignatureDataUrl,
  signatureShadowPath,
} from '@/domain/letter/signatureAsset';

const PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('signatureAsset', () => {
  it('derives shadow path from data URL mime type', () => {
    expect(signatureShadowPath(PNG_DATA_URL)).toBe('/assets/signature.png');
    expect(signatureShadowPath('data:image/jpeg;base64,abc')).toBe('/assets/signature.jpg');
  });

  it('parses data URL into shadow file bytes', () => {
    const asset = parseSignatureDataUrl(PNG_DATA_URL);
    expect(asset?.path).toBe('/assets/signature.png');
    expect(asset?.content.byteLength).toBeGreaterThan(0);
  });

  it('builds Typst image snippet', () => {
    expect(buildSignatureTypst('/assets/signature.png')).toContain('#image("/assets/signature.png"');
  });
});
