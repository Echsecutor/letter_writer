# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Phase 0 scaffold: Vite + React + TypeScript + Tailwind + Vitest + ESLint (strict)
- Layered `src/` module skeleton (`app/`, `ui/`, `hooks/`, `domain/`, `pipeline/`, `infra/`)
- Typed Web Worker protocol (`workerProtocol.ts`) for typst and pandoc workers
- `scripts/vendor-letter-pro.sh` and `scripts/verify-vendored-letter-pro.sh` for vendored `@local/letter-pro:3.0.0`
- GitHub Actions CI: lint, build, vendored letter-pro check, scaffold tests
- Placeholder unit/integration tests for pipeline stages (fail until Phase 1/2)
- Placeholder `templates/letter.typ` and `templates/letter.schema.json`
- Test fixtures under `test/fixtures/`
- Initial `README.md` with project summary, repository layout, and planned local dev workflow
- Initial `CHANGELOG.md` following Keep a Changelog conventions
- Implementation plan for client-only letter writer web app (Typst WASM + letter-pro + pandoc-wasm)
- Developer notes under `.cursor/notes/` (architecture, WASM dependencies, templating, PDF research)
- Legacy pandoc/LaTeX letter draft template at `templates/letter.md`
- AGPL-3.0 license at `LICENSE.txt`
