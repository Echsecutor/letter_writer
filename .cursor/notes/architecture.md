# Architecture

Fully static **client-only SPA** — no backend. Deploy to any CDN (Cloudflare Pages, GitHub Pages).

## Pipeline

```
template id → loadTemplate
           → buildContext(form + schema)
           → fillTemplate (Nunjucks on letter.typ shell)
           → convertBody (plain | pandoc md→typst)  [optional/lazy]
           → assembleDocument (inject at /* BODY_INJECT */)
           → compileTypst (typst worker: SVG preview + PDF bytes)
```

Same assembled Typst source for preview and PDF — **true WYSIWYG**.

Debounce form changes ~300 ms; show loading during WASM compile.

## Source layers (`src/`)

| Layer | Responsibility | Testability |
|-------|----------------|-------------|
| `domain/` | Pure TS: context, escape, schema, Nunjucks adapter | Node unit tests |
| `pipeline/` | `letterPipeline.ts` orchestrator + typed stages | Node integration |
| `infra/` | Workers, WASM paths, `nodeCompiler.ts` for CI | Worker smoke |
| `ui/` | Presentational React — no pipeline imports | Component tests |
| `hooks/` | Debounced pipeline, localStorage drafts | Hook tests |

**Rules:** Nunjucks only in `nunjucksEngine.ts`; no file >400 lines; stages independently unit-tested.

## Web Workers

| Worker | Loaded | Purpose |
|--------|--------|---------|
| `typst.worker.ts` | First preview/PDF | Compile + render; preload letter-pro + fonts |
| `pandoc.worker.ts` | Lazy (markdown body) | Body fragment md→typst only |

Messages typed in `workerProtocol.ts`.

## Key assets

- `public/typst-packages/local/letter-pro/3.0.0/` — vendored; `@local` import
- `public/fonts/` — bundled for WASM (no CDN fetch required in production)
- `templates/letter.typ` + `letter.schema.json`

## Related notes

- [PDF rendering research](./pdf-rendering-research.md) — why Typst WASM over LaTeX / client PDF libs
- [WASM dependencies](./wasm-dependencies.md) — package health, APIs, limits
- [Templating](./templating.md) — Nunjucks, schema, letter.md migration

## Plan reference

Implementation phases, review gates, test fixtures: [letter_writer_web_app.md](../plans/letter_writer_web_app.md).
