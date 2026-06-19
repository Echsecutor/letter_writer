# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- Mark Phase 1 complete in implementation plan (review gate passed)
- Mark Phase 0 complete in implementation plan (review gate passed)
- `vendor-letter-pro.sh` / `verify-vendored-letter-pro.sh` ensure NodeCompiler `@local/letter-pro` symlink under `public/typst-data/`
- Split `loadTemplate` into browser fetch module and Node filesystem module (`loadTemplate.node.ts`)
