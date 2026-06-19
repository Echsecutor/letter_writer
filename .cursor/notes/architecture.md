# Architecture

Fully static **client-only SPA** — no backend. Deploy to any CDN (Cloudflare Pages, GitHub Pages).

## Pipeline

```
template id → loadTemplate (resolves shared.schema.json)
           → buildContext(form + schema)
           → fillTemplate (Nunjucks on adapter shell)
           → convertBody (plain | pandoc md→typst)  [optional/lazy]
           → assembleDocument (inject at /* BODY_INJECT */)
           → compileTypst (typst worker: SVG preview + PDF bytes)
```

Same assembled Typst source for preview and PDF — **true WYSIWYG**.

Debounce form changes ~300 ms; show loading during WASM compile.

## Source layers (`src/`)

| Layer | Responsibility | Testability |
|-------|----------------|-------------|
| `domain/` | Pure TS: context, escape, schema, Nunjucks adapter, draft storage | Node unit tests |
| `pipeline/` | `letterPipeline.ts` orchestrator + typed stages | Node integration |
| `infra/` | Workers, WASM paths, `nodeCompiler.ts` for CI | Worker smoke |
| `ui/` | Presentational React — no pipeline imports | Component tests |
| `hooks/` | Debounced pipeline, localStorage drafts | Hook tests |

**Rules:** Nunjucks only in `nunjucksEngine.ts`; no file >400 lines; stages independently unit-tested.

## Web Workers

| Worker | Loaded | Purpose |
|--------|--------|---------|
| `typst.worker.ts` | First preview/PDF | Compile + render; preload all catalog `@local` packages |
| `pandoc.worker.ts` | Lazy (markdown body) | Body fragment md→typst only |

Messages typed in `workerProtocol.ts`.

## Template catalog

| File | Role |
|------|------|
| `templates/catalog.json` | Ordered template list for `TemplatePicker` |
| `templates/shared.schema.json` | Canonical form fields (all templates) |
| `templates/{id}.typ` | Nunjucks adapter shell → library API |
| `templates/{id}.schema.json` | Thin wrapper extending shared schema |
| `templates/{id}.meta.json` | Catalog metadata (title, description, package pin) |

Catalog packages vendored under `public/typst-packages/local/{name}/{version}/` with `.package-manifest.json` for browser worker file loading.

## Key assets

- `public/typst-packages/local/` — letter-pro, briefs, pc-letter (`@local` imports)
- `public/fonts/` — bundled for WASM (no CDN fetch required in production)

## Related notes

- [PDF rendering research](./pdf-rendering-research.md) — why Typst WASM over LaTeX / client PDF libs
- [WASM dependencies](./wasm-dependencies.md) — package health, APIs, limits
- [Templating](./templating.md) — Nunjucks, schema, letter.md migration
- [Typst letter templates](./typst-letter-templates.md) — catalog research and API mapping

## Plan reference

Implementation phases, review gates, test fixtures: [letter_writer_web_app.md](../plans/letter_writer_web_app.md).

**Phase 0–2 (complete):** Scaffold, Nunjucks fill, plain/markdown body, pandoc worker, form/preview/download UI.

**Phase 3 (complete):** Multi-template catalog with shared schema; template switch preserves user input; ReferenceFields; vendored briefs + pc-letter.
