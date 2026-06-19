#!/usr/bin/env bash
# Vendors letter-pro v3.0.0 for Typst WASM (@local/letter-pro:3.0.0).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${ROOT}/public/typst-packages/local/letter-pro/3.0.0"
REPO="https://github.com/Sematre/typst-letter-pro.git"
TAG="v3.0.0"

if [[ -f "${TARGET}/typst.toml" ]]; then
  echo "letter-pro already vendored at ${TARGET}"
else
  mkdir -p "$(dirname "${TARGET}")"
  TMP="$(mktemp -d)"
  trap 'rm -rf "${TMP}"' EXIT

  git clone --depth 1 --branch "${TAG}" "${REPO}" "${TMP}/letter-pro"
  mkdir -p "${TARGET}"
  cp -a "${TMP}/letter-pro/." "${TARGET}/"

  echo "Vendored letter-pro ${TAG} to ${TARGET}"
fi

TYPST_DATA="${ROOT}/public/typst-data/typst/packages/local"
LETTER_PRO_SRC="${ROOT}/public/typst-packages/local/letter-pro"
mkdir -p "${TYPST_DATA}"
if [[ ! -e "${TYPST_DATA}/letter-pro" ]]; then
  ln -sfn "${LETTER_PRO_SRC}" "${TYPST_DATA}/letter-pro"
  echo "Linked letter-pro for NodeCompiler at ${TYPST_DATA}/letter-pro"
fi
