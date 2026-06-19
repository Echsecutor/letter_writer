#!/usr/bin/env bash
# Vendors a Typst Universe package for WASM (@local/{name}:{version}).
# Usage: vendor-typst-package.sh <git-repo-url> <git-tag> <package-name> <version> [subdir]
set -euo pipefail

if [[ $# -lt 4 ]]; then
  echo "Usage: $0 <git-repo-url> <git-tag> <package-name> <version> [subdir-in-repo]" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="$1"
TAG="$2"
NAME="$3"
VERSION="$4"
SUBDIR="${5:-}"

TARGET="${ROOT}/public/typst-packages/local/${NAME}/${VERSION}"
TYPST_DATA="${ROOT}/public/typst-data/typst/packages/local"
PACKAGE_SRC="${ROOT}/public/typst-packages/local/${NAME}"

if [[ -f "${TARGET}/typst.toml" ]]; then
  echo "${NAME}@${VERSION} already vendored at ${TARGET}"
else
  mkdir -p "$(dirname "${TARGET}")"
  TMP="$(mktemp -d)"
  trap 'rm -rf "${TMP}"' EXIT

  git clone --depth 1 --branch "${TAG}" "${REPO}" "${TMP}/src"
  mkdir -p "${TARGET}"

  if [[ -n "${SUBDIR}" ]]; then
    cp -a "${TMP}/src/${SUBDIR}/." "${TARGET}/"
  else
    cp -a "${TMP}/src/." "${TARGET}/"
  fi

  rm -rf "${TARGET}/.git" 2>/dev/null || true
  echo "Vendored ${NAME} ${TAG} to ${TARGET}"
fi

mkdir -p "${TYPST_DATA}"
if [[ ! -e "${TYPST_DATA}/${NAME}" ]]; then
  ln -sfn "${PACKAGE_SRC}" "${TYPST_DATA}/${NAME}"
  echo "Linked ${NAME} for NodeCompiler at ${TYPST_DATA}/${NAME}"
fi
