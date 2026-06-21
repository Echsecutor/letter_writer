/**
 * Join a Vite-style base URL with a site-root-relative path.
 */
export function joinPublicUrl(base: string, relativePath: string): string {
  const path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${base}${path}`;
}

/**
 * Resolve a site-root-relative path against Vite's configured `base` URL.
 * Use for runtime HTTP fetches (not Typst virtual filesystem paths).
 */
export function publicUrl(relativePath: string): string {
  return joinPublicUrl(import.meta.env.BASE_URL, relativePath);
}
