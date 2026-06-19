# Templating & Template Design

## Why Nunjucks (not Mustache)

| Engine | Default values | Maintenance | Notes |
|--------|----------------|-------------|-------|
| **Nunjucks** | `{{ x \| default("y") }}` native | Stable 3.2.4, low active dev | **Chosen** — wrap in adapter |
| Mustache | None — needs pre-merge or lambdas | Logic-less spec | Rejected for defaults |
| Handlebars | `{{#if}}{{else}}` or custom helper | Similar to Nunjucks | Viable alternative |
| Liquid | `{{ x \| default: "y" }}` | Shopify/Eleventy ecosystem | Viable; less common in Vite SPAs |

Mustache/Handlebars have no native default syntax — requires `{{#if var}}{{var}}{{else}}default{{/if}}` or JS pre-merge.

## Template file split

| File | Role |
|------|------|
| `templates/shared.schema.json` | Canonical form fields for all catalog templates |
| `templates/catalog.json` | Ordered template list for `TemplatePicker` |
| `templates/{id}.typ` | Nunjucks adapter shell → library-specific API |
| `templates/{id}.schema.json` | Thin wrapper extending shared schema |
| `templates/{id}.meta.json` | Catalog metadata (title, description, package) |
| `templates/letter.md` | **Legacy reference only** — pandoc/LaTeX draft; parity tests |

## Migration from [templates/letter.md](../../templates/letter.md)

| Legacy (`letter.md`) | New representation |
|----------------------|-------------------|
| `${Rueckadresse:=…}` | Schema default + `{{ Absender_Adresse \| default("…") }}` |
| YAML front matter fields | `shared.schema.json` |
| `#yourmail:` / `#yourref:` lines | `reference_signs` + `ReferenceFields` UI |
| `${Anschreiben}` body | Form field; injected **post-Nunjucks** at `/* BODY_INJECT */` |
| `\today`, `\bigskip` | JS `today_de` or Typst `#datetime.today().display()` |
| `pandoc --template=letter` | typst.ts compile of assembled `.typ` |

## Nunjucks + Typst conflict avoidance

- Nunjucks delimiters `{{ }}` / `{% %}` only in `.typ` **shell** (metadata).
- User body (markdown/plain) is **never** Nunjucks-processed — injected after fill via `assembleDocument`.
- Marker `/* BODY_INJECT */` replaced with converted typst fragment.
- User strings in shell pass through `typstEscape.ts` before Nunjucks render.

## Adapter shell pattern

Each catalog template has a thin Nunjucks shell mapping shared context → library API. Example (letter-pro):

```typ
#import "@local/letter-pro:3.0.0": letter-simple
#set text(lang: "de")
#show: letter-simple.with( … nunjucks-filled fields … )
/* BODY_INJECT */
```

See also `briefs.typ`, `pc-letter.typ` — [typst-letter-templates.md](./typst-letter-templates.md).

## Schema-driven form

One `shared.schema.json` drives the form for every template — switching template changes layout only, not field IDs.

`buildContext.ts` maps flat form values → Nunjucks context:
- `reference_signs`: `{ label, value }[]` from `ReferenceFields` UI (JSON in draft)
- `Absender_sender_lines`, `Absender_Adresse_typst_array`: library-neutral address shapes
- `Empfaenger_typst`: recipient lines with Typst `\` breaks
- `today_de`: `Intl.DateTimeFormat('de-DE')` default for `Datum`

Field types: `text`, `textarea`, `date`; reference signs via dedicated UI component.

## Body conversion modes

1. **Plain text** — `plainTextToTypst()` in JS (Phase 1; no pandoc).
2. **Markdown** — `pandoc-wasm` md→typst fragment via lazy worker (Phase 2).

Both feed `assembleDocument` at `/* BODY_INJECT */`.

## Multi-template catalog

Curated Typst Universe packages (letter-pro, briefs, pc-letter) vendored as `@local/…`. Details: [typst-letter-templates.md](./typst-letter-templates.md).
