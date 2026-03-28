#!/bin/bash
# Verify all messages_*.properties files have the same keys as messages.properties

set -euo pipefail

BASE="src/main/resources/messages.properties"
EXIT_CODE=0

extract_keys() {
  grep -v '^\s*#' "$1" | grep -v '^\s*$' | sed 's/=.*//' | sort
}

BASE_KEYS=$(extract_keys "$BASE")

for file in src/main/resources/messages_*.properties; do
  FILE_KEYS=$(extract_keys "$file")

  MISSING=$(comm -23 <(echo "$BASE_KEYS") <(echo "$FILE_KEYS"))
  EXTRA=$(comm -13 <(echo "$BASE_KEYS") <(echo "$FILE_KEYS"))

  if [ -n "$MISSING" ]; then
    echo "FAIL: $file - missing keys:"
    echo "$MISSING" | sed 's/^/  /'
    EXIT_CODE=1
  fi

  if [ -n "$EXTRA" ]; then
    echo "FAIL: $file - extra keys (not in base):"
    echo "$EXTRA" | sed 's/^/  /'
    EXIT_CODE=1
  fi
done

if [ $EXIT_CODE -eq 0 ]; then
  echo "OK: All translation files have matching keys."
fi

exit $EXIT_CODE
