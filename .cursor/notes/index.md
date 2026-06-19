# Letter Writer — Notes Index

Client-only letter-writing SPA: **Typst WASM + letter-pro** for DIN 5008 PDF/preview; **Nunjucks** for template fill; **pandoc-wasm** (lazy) for Markdown body fragments only.

## Notes files

| File | Content |
|------|---------|
| [architecture.md](./architecture.md) | Pipeline stages, `src/` layers, workers, asset layout |
| [pdf-rendering-research.md](./pdf-rendering-research.md) | Web research: PDF options matrix, industry patterns, why Typst WASM won |
| [wasm-dependencies.md](./wasm-dependencies.md) | typst.ts, pandoc-wasm, letter-pro, nunjucks — health, APIs, limits, GPL |
| [templating.md](./templating.md) | Nunjucks vs Mustache; schema; `letter.md` → `letter.typ` migration |

## Project structure (current)

| Path | Purpose |
|------|---------|
| `src/app/` | App shell (`App.tsx`, `AppLayout.tsx`) |
| `src/ui/` | Presentational components (no pipeline imports) |
| `src/hooks/` | `useLetterPipeline`, `useDraftPersistence` (Phase 1 stubs) |
| `src/domain/` | Pure TS: context, escape, schema, Nunjucks adapter |
| `src/pipeline/` | Orchestrator + stages + body converters |
| `src/infra/` | Workers (`workerProtocol.ts`), `nodeCompiler.ts` |
| `templates/` | `letter.typ` + `letter.schema.json` (placeholders until Phase 1) |
| `test/fixtures/` | Golden inputs + expected Typst/PDF assertions |
| `public/typst-packages/` | Vendored letter-pro (`@local/letter-pro:3.0.0`) |
| `scripts/` | `vendor-letter-pro.sh`, `verify-vendored-letter-pro.sh` |
| `.github/workflows/ci.yml` | Lint, build, vendored check, scaffold tests |
| `.cursor/plans/` | Implementation plans |

## Plans

- [Letter Writer Web App (WASM)](../plans/letter_writer_web_app.md) — phases, review gates, module layout, test strategy

## Legacy / rules

- [templates/letter.md](../../templates/letter.md) — original pandoc/LaTeX draft; reference for parity tests only
- [markdown-pandoc-formatting.mdc](../rules/markdown-pandoc-formatting.mdc) — pandoc markdown conventions (not used for new Typst templates)
