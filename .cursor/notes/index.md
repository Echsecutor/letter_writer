# Letter Writer — Notes Index

Client-only letter-writing SPA: **Typst WASM + letter-pro** for DIN 5008 PDF/preview; **Nunjucks** for template fill; **pandoc-wasm** (lazy) for Markdown body fragments only.

## Notes files

| File | Content |
|------|---------|
| [architecture.md](./architecture.md) | Pipeline stages, `src/` layers, workers, asset layout |
| [pdf-rendering-research.md](./pdf-rendering-research.md) | Web research: PDF options matrix, industry patterns, why Typst WASM won |
| [wasm-dependencies.md](./wasm-dependencies.md) | typst.ts, pandoc-wasm, letter-pro, nunjucks — health, APIs, limits, GPL |
| [templating.md](./templating.md) | Nunjucks vs Mustache; schema; `letter.md` → `letter.typ` migration |
| [ci-and-containers.md](./ci-and-containers.md) | GitHub Actions verify + GHCR publish, image tags, action versions |

## Project structure (current)

| Path | Purpose |
|------|---------|
| `src/app/` | App shell (`App.tsx`, `AppLayout.tsx`) |
| `src/ui/` | Presentational components (`BodyModeToggle`, form, preview, download — no pipeline imports) |
| `src/hooks/` | `useLetterPipeline` (debounced worker pipeline), `useDraftPersistence` (localStorage) |
| `src/domain/` | Pure TS: context, escape, schema, Nunjucks adapter |
| `src/pipeline/` | Orchestrator + stages + body converters |
| `src/infra/` | Workers (`workerProtocol.ts`, `typst.worker.ts`, `typstClient.ts`, `pandoc.worker.ts`, `pandocClient.ts`), `pandoc/pandocWasm.ts`, `nodeCompiler.ts`, `workerRuntime.ts` |
| `templates/` | `letter.typ` + `letter.schema.json` (Nunjucks + letter-pro) |
| `test/fixtures/` | Golden inputs + expected Typst/PDF assertions |
| `public/typst-packages/` | Vendored letter-pro (`@local/letter-pro:3.0.0`) |
| `public/typst-data/` | Symlink tree for NodeCompiler `@local` package resolution in CI |
| `scripts/` | `vendor-letter-pro.sh`, `verify-vendored-letter-pro.sh` |
| `.github/workflows/ci.yml` | Verify on PRs; GHCR publish (`latest` on `main`, semver tags on `v*.*.*` releases) |
| `Dockerfile`, `docker-compose.yml`, `docker/nginx.conf` | Multi-stage build (Node 22 → nginx Alpine static serve) |
| `.cursor/plans/` | Implementation plans |

## Plans

- [Letter Writer Web App (WASM)](../plans/letter_writer_web_app.md) — phases, review gates, module layout, test strategy

## Legacy / rules

- [templates/letter.md](../../templates/letter.md) — original pandoc/LaTeX draft; reference for parity tests only
- [markdown-pandoc-formatting.mdc](../rules/markdown-pandoc-formatting.mdc) — pandoc markdown conventions (not used for new Typst templates)
