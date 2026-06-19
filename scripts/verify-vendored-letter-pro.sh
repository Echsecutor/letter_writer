#!/usr/bin/env bash
# Verifies vendored letter-pro is present for Typst WASM builds.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${ROOT}/public/typst-packages/local/letter-pro/3.0.0"

if [[ ! -f "${TARGET}/typst.toml" ]]; then
  echo "Missing vendored letter-pro at ${TARGET}" >&2
  echo "Run: ./scripts/vendor-letter-pro.sh" >&2
  exit 1
fi

if [[ ! -d "${TARGET}/src" ]]; then
  echo "Vendored letter-pro appears incomplete (no src/ directory)" >&2
  exit 1
fi

echo "Vendored letter-pro OK: ${TARGET}"
