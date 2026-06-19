# WASM & Key Dependencies

Health assessment and integration notes (2026-06). Pin exact versions in `package.json`.

## typst.ts (primary engine)

| Package | Role |
|---------|------|
| `@myriaddreamin/typst.ts` | JS wrapper / snippet API |
| `@myriaddreamin/typst-ts-web-compiler` | WASM compile (~27 MB unpacked) |
| `@myriaddreamin/typst-ts-renderer` | WASM render to SVG/PDF |

**Verdict:** Healthy — ~22k npm weekly downloads; v0.7.x tracks Typst 0.14; Apache-2.0.

**Browser integration:**
- Dedicated Web Worker — compile takes 200–800 ms; never block UI thread.
- Vite: import WASM with `?url` and pass `getModule: () => url` to `compiler.init()` / `renderer.init()` in `workerRuntime.ts` (required in browser; NodeCompiler skips this).
- Vite: `assetsInclude: ['**/*.wasm']`.
- Import from `@myriaddreamin/typst.ts/compiler` and `/renderer` for tree-shaking — avoid all-in-one bundle (references `window`).
- Init once; cache compiler/renderer instances.
- Preload fonts at worker init (`public/fonts/`): Latin/TeX Gyre + Noto Sans for German umlauts.
- Register vendored packages via `addSource` / shadow FS — no HTTP in WASM sandbox.

**APIs (via worker):**
- Preview: compile → SVG → inject into preview panel.
- PDF: compile → `Uint8Array` → `Blob` download.

**CI:** use `@myriaddreamin/typst-ts-node-compiler` in Node tests (faster than WASM).

## pandoc-wasm (body converter only)

- Official [pandoc/pandoc-wasm](https://github.com/pandoc/pandoc-wasm) wrapper; Pandoc **3.9** WASM included in npm package.
- **Verdict:** Healthy but heavy — lazy-load only when body uses markdown syntax.
- **GPL-2.0-or-later** when distributed (binary is derivative of pandoc).

**Limitations (WASM sandbox):**
1. No HTTP — all files in `files` object.
2. No system commands — Lua filters only, no JSON/exec filters.
3. **No direct PDF** — use for `md → typst` fragment only.
4. Text files as strings OK; binary as `Blob`.

**Usage for Anschreiben body:**
```js
await convert({ from: "markdown", to: "typst", wrap: "none" }, userMarkdown, {});
// → result.stdout = typst fragment
```

**Not used for:** full letter layout (letter-pro handles DIN structure).

## letter-pro (vendored layout)

- Repo: [Sematre/typst-letter-pro](https://github.com/Sematre/typst-letter-pro); MIT; v3.0.0.
- **Verdict:** Adequate — ~200 stars; single maintainer; pin and vendor at fixed tag.
- Vendor: `scripts/vendor-letter-pro.sh` → `public/typst-packages/local/letter-pro/3.0.0/`.
- Import: `#import "@local/letter-pro:3.0.0": letter-simple`

**Key API (`letter-simple.with`):**
- `sender`: `(name, address, extra?)`
- `recipient`: content array with `\` line breaks
- `reference-signs`: tuple of `([label], [value])` pairs — maps from `#yourmail` / `#yourref` fields
- `date`, `subject`, `annotations`

## nunjucks (templating)

- v3.2.4 (Apr 2023); ~3M weekly npm downloads; BSD-2-Clause.
- **Verdict:** Stable but low maintenance — Mozilla unmaintained; v4 stalled.
- **Pin 3.2.4**; import only from `domain/templates/nunjucksEngine.ts` (adapter for future swap).
- Use `{{ field | default("…") }}` for defaults; `{% for %}` for reference-signs.

## markdown2typst (optional fallback)

- MIT; ~80 weekly downloads; Jan 2026.
- **Verdict:** Immature — behind same `BodyConverter` interface if pandoc GPL/size unacceptable.
- Not primary until parity tests pass against pandoc output.

## Rejected libraries

- `markdown-pdfjs` — too immature.
- Server pandoc + TeX Live — ops + preview mismatch.
- `@react-pdf/renderer` — wrong abstraction for DIN letters.
