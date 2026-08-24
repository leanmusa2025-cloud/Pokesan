#!/bin/sh
# Arma NO SALE EL SOL en un solo archivo HTML autoejecutable.
set -e
cd "$(dirname "$0")"
OUT=NoSaleElSol.html
{
  cat src2/00_head.html
  echo '<script>'
  for f in src2/[1-8]*.js; do
    echo "/* ---- $f ---- */"
    cat "$f"
  done
  echo '</script>'
  cat src2/99_tail.html
} > "$OUT"
echo "OK -> $OUT ($(wc -c < "$OUT") bytes)"
