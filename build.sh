#!/bin/sh
# Arma el juego entero en un solo archivo HTML autoejecutable.
set -e
cd "$(dirname "$0")"
OUT=Pokesan.html
{
  cat src/00_head.html
  echo '<script>'
  for f in src/[1-8]*.js; do
    echo "/* ---- $f ---- */"
    cat "$f"
  done
  echo '</script>'
  cat src/99_tail.html
} > "$OUT"
echo "OK -> $OUT ($(wc -c < "$OUT") bytes)"
