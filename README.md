# Letter Writer

Letter Writer is a client-only web app for composing formal German business letters (DIN 5008). Users pick a template, fill a generated form, preview the letter in the browser, and download a PDF — with no backend. Rendering uses Typst in WebAssembly ([typst.ts](https://github.com/Myriad-Dreamin/typst.ts) + [letter-pro](https://typst.app/universe/package/letter-pro/)); optional Markdown body text is converted via [pandoc-wasm](https://github.com/pandoc/pandoc-wasm).

## Repository overview

Single-project repository (no monorepo). The Vite/React app is planned at the repo root once Phase 0 scaffolding lands.

| Path | Purpose |
|------|---------|
| `.cursor/plans/letter_writer_web_app.md` | Architecture, implementation phases, review gates, test strategy |
| `.cursor/notes/` | Agent/developer notes ([index](.cursor/notes/index.md): pipeline, WASM deps, templating) |
| `templates/` | Letter templates — legacy `letter.md` (pandoc/LaTeX); future `.typ` + `.schema.json` |
| `LICENSE.txt` | AGPL-3.0 |

**Planned layout** (not yet present): `src/` (app, UI, pipeline, workers), `public/typst-packages/` (vendored letter-pro), `test/fixtures/`, `scripts/vendor-letter-pro.sh`.

**Deployment / CI:** Not configured yet. Target is static hosting (e.g. GitHub Pages or Cloudflare Pages) after Phase 3.

## Usage

### Deployed environments

No public deployment yet.

### Local development

The web app is not scaffolded yet. Implementation starts with Phase 0 in the [implementation plan](.cursor/plans/letter_writer_web_app.md).

Once Phase 0 is complete, local development will look like:

```bash
npm install
./scripts/vendor-letter-pro.sh   # vendored letter-pro for Typst WASM
npm run dev
```

Other planned scripts:

```bash
npm run test      # unit + integration (Node typst compiler)
npm run lint
npm run build     # static output for CDN deploy
```

**First-load size:** expect ~15 MB without pandoc; ~30 MB if the Markdown body converter (pandoc-wasm, GPL-2.0) is loaded. See the plan for lazy-loading details.

## License

Application code: [AGPL-3.0](LICENSE.txt).

Third-party runtime dependencies include Apache-2.0 (typst.ts), MIT (letter-pro), BSD-2-Clause (nunjucks), and GPL-2.0-or-later (pandoc-wasm, loaded only when converting Markdown body text).
