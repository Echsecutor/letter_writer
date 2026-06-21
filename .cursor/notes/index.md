# Letter Writer — Notes Index

Client-only letter-writing SPA: **Typst WASM + letter-pro / briefs / pc-letter** for DIN 5008 PDF/preview; **Nunjucks** for template fill; **pandoc-wasm** (lazy) for Markdown body fragments only.

## Notes files

| File | Content |
|------|---------|
| [architecture.md](./architecture.md) | Pipeline stages, `src/` layers, workers, template catalog, asset layout |
| [pdf-rendering-research.md](./pdf-rendering-research.md) | Web research: PDF options matrix, industry patterns, why Typst WASM won |
| [wasm-dependencies.md](./wasm-dependencies.md) | typst.ts, pandoc-wasm, letter-pro, briefs, pc-letter, nunjucks — health, APIs, limits, GPL |
| [templating.md](./templating.md) | Nunjucks vs Mustache; schema; `letter.md` → adapter shells migration |
| [typst-letter-templates.md](./typst-letter-templates.md) | Phase 3 catalog research: letter-pro, briefs, pc-letter; shared schema contract |
| [ci-and-containers.md](./ci-and-containers.md) | GitHub Actions verify + GHCR publish, image tags, action versions |

## Project structure (current)

| Path | Purpose |
|------|---------|
| `src/app/` | App shell (`App.tsx`, `AppLayout.tsx`) |
| `src/ui/` | Presentational components (`TemplatePicker`, `LetterForm`, `ReferenceFields`, preview, download) |
| `src/hooks/` | `useLetterPipeline` (debounced worker pipeline), `useDraftPersistence` (localStorage) |
| `src/domain/` | Pure TS: context, escape, schema, Nunjucks adapter, draft storage |
| `src/pipeline/` | Orchestrator + stages + body converters |
| `src/infra/` | Workers, WASM paths, `nodeCompiler.ts`, `localTypstPackages.ts` |
| `templates/` | `catalog.json`, `shared.schema.json`, adapter shells + meta per template id |
| `test/fixtures/` | Golden inputs + expected Typst/PDF assertions |
| `public/typst-packages/` | Vendored `@local` packages (letter-pro, briefs, pc-letter) |
| `public/typst-data/` | Symlink tree for NodeCompiler `@local` package resolution in CI |
| `scripts/` | `vendor-typst-package.sh`, `vendor-all-packages.sh`, `verify-vendored-packages.sh` |
| `.github/workflows/ci.yml` | Verify on PRs; GHCR publish (`latest` on `main`, semver tags on `v*.*.*` releases) |
| `.github/workflows/pages.yml` | Build + deploy static app to GitHub Pages on `main` |
| `Dockerfile`, `docker-compose.yml`, `docker/nginx.conf` | Multi-stage build (Node 22 → nginx Alpine static serve) |
| `.cursor/plans/` | Implementation plans |

## Plans

- [Letter Writer Web App (WASM)](../plans/letter_writer_web_app.md) — phases, review gates, module layout, test strategy

## Legacy / rules

- [templates/letter.md](../../templates/letter.md) — original pandoc/LaTeX draft; reference for parity tests only
- [markdown-pandoc-formatting.mdc](../rules/markdown-pandoc-formatting.mdc) — pandoc markdown conventions (not used for new Typst templates)
