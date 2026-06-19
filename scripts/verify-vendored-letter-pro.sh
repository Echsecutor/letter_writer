#!/usr/bin/env bash
# Verifies vendored letter-pro is present for Typst WASM builds.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec bash "${ROOT}/scripts/verify-vendored-packages.sh"
