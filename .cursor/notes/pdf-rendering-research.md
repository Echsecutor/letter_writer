# PDF & Markdown Rendering — Research Summary

Research conducted during architecture planning (2026-06). Informs why we chose **Typst WASM + letter-pro** over server LaTeX or lightweight client PDF libs.

## Decision matrix (evaluated options)

| Approach | Quality | Hosting | Preview = PDF | Verdict |
|----------|---------|---------|---------------|---------|
| **Typst WASM + letter-pro** | DIN 5008 letters, LaTeX-class typography | Static CDN | Yes (same Typst → SVG / PDF) | **Chosen** |
| Pandoc + LaTeX (server) | Best for long-form; scrlttr2 letters | Backend + TeX (~1 GB) | No (HTML preview approximate) | Rejected — ops cost, preview mismatch |
| Pandoc WASM → Typst WASM chain | Good when layout is Typst-native | Static | Yes if same Typst source | Used partially (body md→typst only) |
| Browser `window.print` on HTML | OS fonts, GFM markdown | Static | Yes for simple docs | Rejected — no DIN letter geometry |
| Playwright/Puppeteer HTML→PDF | Full CSS3, automatable | Backend + Chromium (~300 MB) | Yes | Rejected — reinventing DIN layout in CSS |
| `@react-pdf/renderer` | Vector text, searchable | Static | Custom layout code | Rejected — poor fit for formal letters |
| `markdown-pdfjs` | Unknown; ~4 GitHub stars | Static | Unclear | **Rejected** — immature, no letter support |
| `markdown2typst` | Lightweight md→typst | Static | N/A (fragment only) | Optional fallback behind `BodyConverter` |

## Industry patterns (web research)

**Markdown → PDF is never direct.** Typical pipelines:

```
Markdown → HTML → browser print → PDF     (client, privacy-first tools)
Markdown → HTML → headless Chromium → PDF (Node backends, 200–500 ms warm)
Markdown → LaTeX → TeX engine → PDF       (pandoc CLI, publication quality)
Markdown → Typst → typst compile → PDF    (modern, smaller than TeX)
```

**Pandoc WASM limitation (official):** cannot run external programs — no direct PDF output. Must chain to Typst WASM (or similar) for PDF. See [pandoc-wasm README](https://github.com/pandoc/pandoc-wasm).

**Pandoc 3.9 WASM:** official since Feb 2026; ~16 MB gzip / ~58 MB uncompressed; [pandoc.org/app](https://pandoc.org/app) demo includes Typst PDF via bundled Typst WASM.

**Typst.ts:** splits compiler (~8 MB gzip) and renderer (~350 KB); `$typst.svg()` and `$typst.pdf()` from same `mainContent`; run in Web Workers. Fonts ~5 MB additional. Reference: [typst.ts docs](https://myriad-dreamin.github.io/typst.ts/cookery/get-started.html).

**Prior art:** jupyterlite-pdf-exporter, DOCX→PDF browser converters — same pandoc-wasm + typst pattern.

## Why letter-pro specifically

- [letter-pro](https://typst.app/universe/package/letter-pro/) — DIN 5008 business letter template for Typst (MIT, v3.0.0).
- Alternatives considered: `briefs`, `pc-letter`, `typst-din-5008-letter` — letter-pro has clearest DIN 5008 API (`sender`, `recipient`, `reference-signs`, `subject`, `date`).
- WASM constraint: `@preview/letter-pro` cannot be fetched at runtime — **vendor as `@local/letter-pro:3.0.0`**.

## Bundle size budget (first visit)

| Asset | ~gzip |
|-------|-------|
| typst-ts-web-compiler | 8 MB |
| typst-ts-renderer | 350 KB |
| Fonts | 5 MB |
| pandoc.wasm (lazy) | 16 MB |
| App JS | < 500 KB |
| **Total with pandoc** | **~30 MB** |

Mitigations: lazy pandoc worker, progress UI, service-worker cache, optional `markdown2typst` if GPL/size blocks adoption.

## Licensing impact

- `pandoc-wasm` npm bundle: **GPL-2.0-or-later** (contains pandoc.wasm).
- `typst.ts`: Apache-2.0.
- `letter-pro`: MIT.
