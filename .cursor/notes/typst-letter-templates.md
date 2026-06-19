# Typst Letter Template Research (2026-06)

Web research for Phase 3 multi-template catalog. Goal: offer **real letter libraries** from Typst Universe (vendored as `@local/…` for WASM), not placeholder shells.

## Selection criteria

| Criterion | Why |
|-----------|-----|
| Typst Universe package | Pin version; vendor via git tag into `public/typst-packages/local/` |
| DIN 5008 / German business fit | Primary audience; A4 + window envelope alignment |
| Permissive license (MIT/Apache) | Static SPA redistribution |
| Maps to shared form fields | User switches style without re-entering text |
| Maintainer activity | Pin exact version; visual regression before bump |

## Recommended catalog (Phase 3 MVP)

| Template ID | Package | Version | License | Style | Stars / notes |
|-------------|---------|---------|---------|-------|---------------|
| `letter-pro` | [letter-pro](https://typst.app/universe/package/letter-pro/) | 3.0.0 | MIT | Formal DIN 5008 business | ~200★; **current default** (`templates/letter-pro.typ`) |
| `briefs` | [briefs](https://typst.app/universe/package/briefs/) | 0.3.0 | MIT | Minimal DIN-inspired, NGO/standard | 12★; address box = DIN lang window |
| `pc-letter` | [pc-letter](https://typst.app/universe/package/pc-letter/) | 0.4.0 | MIT | Classic correspondence, DIN-compatible | Multilingual (`de`, `de-AT`); print/digital variants |

## Deferred / not in MVP catalog

| Package | Reason to defer |
|---------|-----------------|
| [pro-letter](https://typst.app/universe/package/pro-letter/) 0.1.1 | US-letter default, English salutation/closing; poor German DIN fit |
| [letterloom](https://typst.app/universe/package/letterloom/) | English business letter conventions |
| [appreciated-letter](https://typst.app/universe/package/appreciated-letter/) 0.1.0 | Basic; US-centric examples; thin API |
| [ludwig-austermann/typst-din-5008-letter](https://github.com/ludwig-austermann/typst-din-5008-letter) | Not on Universe; manual vendor; envelope sub-template adds scope |
| [pascal-huber/typst-letter-template](https://github.com/pascal-huber/typst-letter-template) | Not on Universe preview; author warns breaking changes |
| [dvdvgt/typst-letter](https://github.com/dvdvgt/typst-letter) | C6/5 envelope focus; not Universe |

## Shared form contract

One **canonical schema** drives the form for all templates. Template switch changes only the Typst shell + vendored package — not field IDs.

| Canonical field | Purpose | letter-pro | briefs | pc-letter |
|-----------------|---------|------------|--------|-----------|
| `Absender_Name` | Sender name | `sender.name` | `sender[0]` (line 1) | `author.name` |
| `Absender_Adresse` | Sender address | `sender.address` | `sender[1…]` (split lines) | `author.address` tuple |
| `Empfaenger` | Recipient (multiline) | `recipient` content | `recipient` content | `address-field` content |
| `Betreff` | Subject | `subject` | `subject` | init `subject` / heading |
| `Datum` | Date | `date` | `date` (with optional `location`) | init date |
| `Anschreiben` | Body | `/* BODY_INJECT */` | body after show rule | after field macros |
| `reference_signs[]` | Ihr Zeichen / Unser Zeichen | `reference-signs` tuples | `information-extra` (approx.) | `reference-field` (first ref) |
| `Ort` (optional, Phase 3) | Place before date | — | `location` | `place-name` in init |

Optional fields unsupported by a template are **ignored in that shell** — no form change required.

## Adapter pattern

Each template = `{id}.typ` (Nunjucks shell mapping shared context → library API) + `{id}.meta.json` (title, description, preview image path). All templates **reuse** `shared.schema.json` (or identical field list).

`buildContext.ts` stays library-neutral. Only shell files differ.

## WASM vendoring

Generalize `scripts/vendor-letter-pro.sh` → `scripts/vendor-typst-package.sh <repo> <tag> <namespace/name> <version>`.

Typst worker pre-registers all catalog packages via `addSource` / shadow FS (same as letter-pro today). Consider lazy registration per template if init time grows.

## UI

`TemplatePicker` loads `templates/catalog.json`; shows title + one-line description + optional thumbnail (generated PDF/SVG snapshot per template). Switching template keeps `values` + `bodyMode` in localStorage.

## References

- [letter-pro Universe](https://typst.app/universe/package/letter-pro/)
- [briefs Universe + GitHub](https://github.com/tndrle/briefs)
- [pc-letter Universe](https://typst.app/universe/package/pc-letter/)
- Plan: [letter_writer_web_app.md](../plans/letter_writer_web_app.md) Phase 3
