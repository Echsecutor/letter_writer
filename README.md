[![CI](https://github.com/Echsecutor/letter_writer/actions/workflows/ci.yml/badge.svg)](https://github.com/Echsecutor/letter_writer/actions/workflows/ci.yml)

# Letter Writer

Letter Writer is a client-only web app for composing formal German business letters (DIN 5008). Users pick a template from a curated catalog, fill a shared form, preview the letter in the browser, and download a PDF — with no backend. Rendering uses Typst in WebAssembly ([typst.ts](https://github.com/Myriad-Dreamin/typst.ts) + vendored Universe packages); optional Markdown body text is converted via [pandoc-wasm](https://github.com/pandoc/pandoc-wasm) (GPL-2.0, lazy-loaded).

## Repository overview

Single-project Vite/React app at the repo root.

| Path | Purpose |
|------|---------|
| `src/app/` | App shell and layout |
| `src/ui/` | Presentational React components |
| `src/hooks/` | Pipeline wiring and draft persistence |
| `src/domain/` | Pure TS: context, escape, schema, Nunjucks adapter |
| `src/pipeline/` | Orchestrator + typed stages + body converters |
| `src/infra/` | Web Workers, WASM, Node compiler for CI |
| `templates/` | Catalog (`catalog.json`), shared schema, adapter `.typ` shells |
| `test/fixtures/` | Golden inputs and expected artifacts |
| `public/typst-packages/` | Vendored `@local` packages (letter-pro, briefs, pc-letter) |
| `scripts/` | `vendor-all-packages.sh`, `verify-vendored-packages.sh` |
| `.cursor/plans/` | [Implementation plan](.cursor/plans/letter_writer_web_app.md) |
| `.cursor/notes/` | Developer notes ([index](.cursor/notes/index.md)) |
| `.github/workflows/ci.yml` | Lint, build, tests; push Docker image to GHCR on `main` and release tags |
| `Dockerfile`, `docker-compose.yml` | Container build (Node 22) and nginx static serving |
| `docker/nginx.conf` | Runtime web server config for the production image |
| `LICENSE.txt` | AGPL-3.0 |

Legacy pandoc/LaTeX draft: `templates/letter.md` (parity reference only).

## Template catalog

| Template ID | Package | Style |
|-------------|---------|-------|
| `letter-pro` | letter-pro 3.0.0 | Formal DIN 5008 business letter |
| `briefs` | briefs 0.3.0 | Minimal DIN-inspired, window envelope alignment |
| `pc-letter` | pc-letter 0.4.0 | Classic/personal correspondence |

All templates share `templates/shared.schema.json`. Switching templates keeps form values and body mode.

## Usage

### Deployed environments

Static output from `npm run build` (or the GHCR image) can be deployed to any CDN (Cloudflare Pages, GitHub Pages, nginx). No server-side rendering required.

### Local development

```bash
npm install
npm run vendor:packages   # vendored Typst packages for WASM + NodeCompiler
npm run dev
```

Other scripts:

```bash
npm run test
npm run test:scaffold
npm run lint
npm run build
npm run verify:vendored
```

### Docker

```bash
docker compose up --build
```

Open http://localhost:8080 (override host port with `LETTER_WRITER_PORT=3000 docker compose up --build`).

### CI and container images

On every push to `main`, GitHub Actions runs lint, build, and tests, then builds and pushes `ghcr.io/<owner>/letter_writer:latest` to the [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

Release tags matching `vMAJOR.MINOR.PATCH` publish semver tags (`1.0.0`, `1.0`, `1`) in addition to `latest`.

```bash
docker pull ghcr.io/echsecutor/letter_writer:latest
docker run --rm -p 8080:80 ghcr.io/echsecutor/letter_writer:latest
```

**First-load size:** ~15 MB without pandoc; ~30 MB with pandoc-wasm (lazy-loaded on first Markdown body). See the [implementation plan](.cursor/plans/letter_writer_web_app.md).

## License

Application code: [AGPL-3.0](LICENSE.txt).

Third-party runtime dependencies include Apache-2.0 (typst.ts), MIT (letter-pro, briefs, pc-letter), BSD-2-Clause (nunjucks), and GPL-2.0-or-later (pandoc-wasm, loaded only when converting Markdown body text).
