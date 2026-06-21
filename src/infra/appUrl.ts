let configuredAppRoot: string | undefined;

/** Called from the typst worker during init; main thread uses `document.baseURI`. */
export function configureAppRoot(url: string): void {
  configuredAppRoot = url.endsWith('/') ? url : `${url}/`;
}

export function getAppRootUrl(): string {
  if (configuredAppRoot) {
    return configuredAppRoot;
  }
  if (typeof document !== 'undefined') {
    return new URL('./', document.baseURI).href;
  }
  throw new Error('App root URL is not available');
}

/** Resolve a site-root-relative path against the deployed app root. */
export function resolveAppPath(relativePath: string, rootUrl = getAppRootUrl()): string {
  const normalized = relativePath.replace(/^\//, '');
  return new URL(normalized, rootUrl).href;
}

/** Resolve a site-root-relative path for runtime HTTP fetches (not Typst virtual paths). */
export function appUrl(relativePath: string): string {
  return resolveAppPath(relativePath);
}
