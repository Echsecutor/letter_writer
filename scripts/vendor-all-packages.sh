#!/usr/bin/env bash
# Vendors all catalog Typst packages for the letter writer app.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="${ROOT}/scripts/vendor-typst-package.sh"

bash "${VENDOR}" \
  "https://github.com/Sematre/typst-letter-pro.git" \
  "v3.0.0" \
  "letter-pro" \
  "3.0.0"

bash "${VENDOR}" \
  "https://github.com/tndrle/briefs.git" \
  "v0.3.0" \
  "briefs" \
  "0.3.0"

bash "${VENDOR}" \
  "https://github.com/thatfloflo/typst-pc-letter.git" \
  "v0.4.0" \
  "pc-letter" \
  "0.4.0"

node "${ROOT}/scripts/generate-package-manifests.mjs"

echo "All catalog packages vendored."
