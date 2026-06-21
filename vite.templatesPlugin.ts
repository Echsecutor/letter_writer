import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

function contentType(filePath: string): string {
  if (filePath.endsWith('.json')) {
    return 'application/json';
  }
  return 'text/plain; charset=utf-8';
}

function publicPath(base: string, relativePath: string): string {
  const path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${base}${path}`;
}

export function templatesPlugin(rootDir: string): Plugin {
  const templatesDir = path.join(rootDir, 'templates');
  const publicTemplatesDir = path.join(rootDir, 'public/templates');

  return {
    name: 'letter-writer-templates',
    configureServer(server) {
      const route = publicPath(server.config.base, 'templates').replace(/\/$/, '');
      server.middlewares.use(route, (req, res, next) => {
        const urlPath = decodeURIComponent(req.url?.split('?')[0] ?? '/');
        const filePath = path.normalize(path.join(templatesDir, urlPath));
        if (!filePath.startsWith(templatesDir) || !existsSync(filePath)) {
          next();
          return;
        }
        res.setHeader('Content-Type', contentType(filePath));
        res.end(readFileSync(filePath));
      });
    },
    buildStart() {
      mkdirSync(publicTemplatesDir, { recursive: true });
      cpSync(templatesDir, publicTemplatesDir, { recursive: true });
    },
  };
}
