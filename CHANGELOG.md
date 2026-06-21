# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions workflow (`.github/workflows/pages.yml`) to build the Vite app and publish static assets to GitHub Pages on pushes to `main`
- Optional signature image upload (`Unterschrift`) rendered below the letter body in all catalog templates

### Changed
- Standardbrief (`letter-pro`): Bezugszeichen show fixed labels (`Ihr Zeichen:` / `Unser Zeichen:`) inline with values
- Letter date output uses German formatting (`02.01.2026`) and `Ort, den DD.MM.YYYY` when place is set

### Fixed
- Removed unnecessary guard in `ReferenceFields.removeRow` that failed ESLint `@typescript-eslint/no-unnecessary-condition`
- Bezugszeichen rows and letter output only appear when a value is entered
- Typst WASM preview and PDF download in the browser by passing Vite-bundled `getModule` URLs to the compiler and renderer init
- Pipeline errors no longer stuck behind infinite "Vorschau wird erstellt…" loading state (`useLetterPipeline` marks failed inputs as resolved)

### Added

- Phase 3: Template catalog (`letter-pro`, `briefs`, `pc-letter`) with `templates/catalog.json` and `templates/shared.schema.json`
- Phase 3: Adapter shells (`letter-pro.typ`, `briefs.typ`, `pc-letter.typ`) mapping shared form fields to each library API
- Phase 3: Generic vendoring (`vendor-typst-package.sh`, `vendor-all-packages.sh`, `verify-vendored-packages.sh`) for briefs@0.3.0 and pc-letter@0.4.0
- Phase 3: `TemplatePicker` loads catalog; template switch preserves form values and body mode
- Phase 3: `ReferenceFields` UI for Bezugszeichen (`reference_signs`) with per-template adapter mapping
- Phase 3: Optional `Ort` field for briefs `location` and pc-letter `place-name`
- Phase 3: Multi-library `buildContext` helpers (`Absender_sender_lines`, `Absender_Adresse_typst_array`, `Datum_datetime_typst`)
- Phase 3: Typst worker registers all catalog `@local` packages via `.package-manifest.json`
- Phase 3: Integration tests — PDF per catalog template; adapter shell and draft persistence unit tests
- Phase 2: Markdown body conversion via lazy-loaded `pandoc.worker.ts` and `pandocClient.ts`
- Phase 2: `convertBody` stage with injectable `BodyConverter`; `nodePandocConverter` for CI tests
- Phase 2: `BodyModeToggle` UI (plain text vs Markdown) with `bodyMode` persisted in localStorage drafts
- Phase 2: Golden fixture `expected-body.typ` and integration tests (markdown pipeline, legacy parity)
- Multi-stage `Dockerfile` and `docker-compose.yml` to build the Vite app and serve static output with nginx Alpine
- `docker/nginx.conf` for static asset caching and WASM MIME serving
- Phase 1: Nunjucks template fill (`letter.typ`, `buildContext`, `fillTemplate`, `assembleDocument`)
- Phase 1: Plain-text body conversion via `plainTextToTypst`
- Phase 1: Typst WASM worker (`typst.worker.ts`, `workerRuntime.ts`, `typstClient.ts`) for SVG preview + PDF download
- Phase 1: NodeCompiler adapter (`nodeCompiler.ts`) for CI PDF integration tests
- Phase 1: Working UI — schema-driven form, debounced preview, PDF download, localStorage drafts
- Phase 1: Vite plugins to serve/copy `templates/` and link `public/typst-data` for NodeCompiler package resolution
- Phase 1: Golden fixture `expected-shell.typ` and passing unit/integration tests for plain-body pipeline
- Phase 0 scaffold: Vite + React + TypeScript + Tailwind + Vitest + ESLint (strict)
- Layered `src/` module skeleton (`app/`, `ui/`, `hooks/`, `domain/`, `pipeline/`, `infra/`)
- Typed Web Worker protocol (`workerProtocol.ts`) for typst and pandoc workers
- `scripts/vendor-letter-pro.sh` and `scripts/verify-vendored-letter-pro.sh` for vendored `@local/letter-pro:3.0.0`
- GitHub Actions CI: lint, build, vendored letter-pro check, scaffold tests
- Test fixtures under `test/fixtures/`
- Initial `README.md` with project summary, repository layout, and planned local dev workflow
- Initial `CHANGELOG.md` following Keep a Changelog conventions
- Implementation plan for client-only letter writer web app (Typst WASM + letter-pro + pandoc-wasm)
- Developer notes under `.cursor/notes/` (architecture, WASM dependencies, templating, PDF research)
- Legacy pandoc/LaTeX letter draft template at `templates/letter.md`
- AGPL-3.0 license at `LICENSE.txt`

### Changed

- Renamed default template id `letter` → `letter-pro` with draft migration via `normalizeTemplateId`
- Phase 3 plan: replace placeholder second template with researched Typst catalog (letter-pro, briefs, pc-letter) and shared form schema for style switching
- `letterPipeline.ts` routes body text through `convertBody` (fixes Phase 1 gap where `bodyMode` was ignored)
- Mark Phase 2 complete in implementation plan (review gate passed)
- Mark Phase 1 complete in implementation plan (review gate passed)
- Mark Phase 0 complete in implementation plan (review gate passed)
- `vendor-letter-pro.sh` / `verify-vendored-letter-pro.sh` ensure NodeCompiler `@local/letter-pro` symlink under `public/typst-data/`
- Split `loadTemplate` into browser fetch module and Node filesystem module (`loadTemplate.node.ts`)
