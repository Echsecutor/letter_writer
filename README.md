# Letter Writer

Letter Writer is a client-only web app for composing formal German business letters (DIN 5008). Users pick a template, fill a generated form, preview the letter in the browser, and download a PDF — with no backend. Rendering uses Typst in WebAssembly ([typst.ts](https://github.com/Myriad-Dreamin/typst.ts) + [letter-pro](https://typst.app/universe/package/letter-pro/)); optional Markdown body text is converted via [pandoc-wasm](https://github.com/pandoc/pandoc-wasm).

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
| `templates/` | Letter `.typ` shells + `.schema.json` form definitions |
| `test/fixtures/` | Golden inputs and expected artifacts |
| `public/typst-packages/` | Vendored letter-pro (`@local/letter-pro:3.0.0`) |
| `scripts/` | `vendor-letter-pro.sh`, `verify-vendored-letter-pro.sh` |
| `.cursor/plans/` | [Implementation plan](.cursor/plans/letter_writer_web_app.md) |
| `.cursor/notes/` | Developer notes ([index](.cursor/notes/index.md)) |
| `.github/workflows/ci.yml` | Lint, build, vendored check, scaffold tests |
| `Dockerfile`, `docker-compose.yml` | Container build (Node 22) and nginx static serving |
| `docker/nginx.conf` | Runtime web server config for the production image |
| `LICENSE.txt` | AGPL-3.0 |

Legacy pandoc/LaTeX draft: `templates/letter.md` (parity reference only).

## Usage

### Deployed environments

No public deployment yet (Phase 3).

### Local development

```bash
npm install
./scripts/vendor-letter-pro.sh   # vendored letter-pro for Typst WASM
npm run dev
```

Other scripts:

```bash
npm run test            # all tests (Phase 0: pipeline placeholders fail until Phase 1)
npm run test:scaffold   # passing scaffold tests (CI)
npm run lint
npm run build           # static output for CDN deploy
npm run verify:vendored # check letter-pro is present
```

### Docker

Build and serve the production static bundle (same steps as CI: vendor letter-pro, typecheck, Vite build):

```bash
docker compose up --build
```

Open http://localhost:8080 (override host port with `LETTER_WRITER_PORT=3000 docker compose up --build`).

**First-load size (planned):** ~15 MB without pandoc; ~30 MB with pandoc-wasm (GPL-2.0, lazy-loaded). See the [implementation plan](.cursor/plans/letter_writer_web_app.md).

## License

Application code: [AGPL-3.0](LICENSE.txt).

Third-party runtime dependencies include Apache-2.0 (typst.ts), MIT (letter-pro), BSD-2-Clause (nunjucks), and GPL-2.0-or-later (pandoc-wasm, loaded only when converting Markdown body text).
