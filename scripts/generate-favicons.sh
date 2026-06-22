#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="${1:-$root/letter_writer.png}"
out="$root/public"

if [[ ! -f "$src" ]]; then
  echo "Source icon not found: $src" >&2
  exit 1
fi

if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick convert is required." >&2
  exit 1
fi

mkdir -p "$out"

convert "$src" -resize 16x16 "$out/favicon-16x16.png"
convert "$src" -resize 32x32 "$out/favicon-32x32.png"
convert "$src" -resize 48x48 "$out/icon.png"
convert "$src" -resize 180x180 "$out/apple-touch-icon.png"
convert "$src" -resize 192x192 "$out/android-chrome-192x192.png"
convert "$src" -resize 512x512 "$out/android-chrome-512x512.png"
convert "$out/favicon-16x16.png" "$out/favicon-32x32.png" "$out/favicon.ico"

echo "Generated favicons in $out from $src"
