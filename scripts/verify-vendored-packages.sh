#!/usr/bin/env bash
# Verifies all catalog Typst packages are present for WASM and NodeCompiler.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TYPST_DATA="${ROOT}/public/typst-data/typst/packages/local"

PACKAGES=(
  "letter-pro:3.0.0"
  "briefs:0.3.0"
  "pc-letter:0.4.0"
)

entrypoint_for() {
  local name="$1"
  local version="$2"
  local toml="${ROOT}/public/typst-packages/local/${name}/${version}/typst.toml"
  if [[ ! -f "${toml}" ]]; then
    echo ""
    return
  fi
  python3 - <<PY
import pathlib
import re
text = pathlib.Path("${toml}").read_text()
match = re.search(r'^entrypoint\s*=\s*"([^"]+)"', text, re.M)
print(match.group(1) if match else "")
PY
}

for entry in "${PACKAGES[@]}"; do
  name="${entry%%:*}"
  version="${entry##*:}"
  target="${ROOT}/public/typst-packages/local/${name}/${version}"
  link="${TYPST_DATA}/${name}"

  if [[ ! -f "${target}/typst.toml" ]]; then
    echo "Missing vendored ${name}@${version} at ${target}" >&2
    echo "Run: bash scripts/vendor-all-packages.sh" >&2
    exit 1
  fi

  entrypoint="$(entrypoint_for "${name}" "${version}")"
  if [[ -z "${entrypoint}" || ! -f "${target}/${entrypoint}" ]]; then
    echo "Vendored ${name} appears incomplete (missing entrypoint ${entrypoint})" >&2
    exit 1
  fi

  if [[ ! -e "${link}" ]]; then
    echo "Missing NodeCompiler package link at ${link}" >&2
    echo "Run: bash scripts/vendor-all-packages.sh" >&2
    exit 1
  fi

  echo "Vendored ${name}@${version} OK"
done
