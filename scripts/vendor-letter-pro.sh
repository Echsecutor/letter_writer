#!/usr/bin/env bash
# Vendors letter-pro v3.0.0 for Typst WASM (@local/letter-pro:3.0.0).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec bash "${ROOT}/scripts/vendor-typst-package.sh" \
  "https://github.com/Sematre/typst-letter-pro.git" \
  "v3.0.0" \
  "letter-pro" \
  "3.0.0"
