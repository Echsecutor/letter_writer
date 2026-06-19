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
| `templates/letter.typ` | Nunjucks-processed Typst shell importing letter-pro |
| `templates/letter.schema.json` | Form field defs: keys, labels, types, defaults, groups |
| `templates/letter.md` | **Legacy reference only** — pandoc/LaTeX draft; parity tests |

## Migration from [templates/letter.md](../../templates/letter.md)

| Legacy (`letter.md`) | New representation |
|----------------------|-------------------|
| `${Rueckadresse:=…}` | Schema default + `{{ Rueckadresse \| default("…") }}` |
| YAML front matter fields | `letter.schema.json` |
| `#yourmail:` / `#yourref:` lines | `reference-signs` in letter-pro + `ReferenceFields` UI |
| `${Anschreiben}` body | Form field; injected **post-Nunjucks** at `/* BODY_INJECT */` |
| `\today`, `\bigskip` | JS `today_de` or Typst `#datetime.today().display()` |
| `pandoc --template=letter` | typst.ts compile of assembled `.typ` |

## Nunjucks + Typst conflict avoidance

- Nunjucks delimiters `{{ }}` / `{% %}` only in `.typ` **shell** (metadata).
- User body (markdown/plain) is **never** Nunjucks-processed — injected after fill via `assembleDocument`.
- Marker `/* BODY_INJECT */` replaced with converted typst fragment.
- User strings in shell pass through `typstEscape.ts` before Nunjucks render.

## Shell structure (letter.typ)

```typ
#import "@local/letter-pro:3.0.0": letter-simple
#set text(lang: "de")
#show: letter-simple.with( … nunjucks-filled fields … )
/* BODY_INJECT */
```

## Schema-driven form

`buildContext.ts` maps flat form values → Nunjucks context:
- `reference_signs`: `{ label, value }[]` from optional reference fields
- `Empfaenger_typst`: recipient lines with Typst `\` breaks
- `today_de`: `Intl.DateTimeFormat('de-DE')` default for `Datum`

Field types: `text`, `textarea`, `markdown` (body), grouped `references`.

## Body conversion modes

1. **Plain text** — `plainTextToTypst()` in JS (Phase 1; no pandoc).
2. **Markdown** — `pandoc-wasm` md→typst fragment via lazy worker (Phase 2).

Both feed `assembleDocument` at `/* BODY_INJECT */`.
