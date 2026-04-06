#!/usr/bin/env bash
# PostToolUse hook — auto-formats files after Edit/Write.
# Silently skips if formatter not installed. Never blocks.

set -euo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  py)
    if command -v ruff &>/dev/null; then
      ruff format --quiet "$FILE" 2>/dev/null || true
    elif command -v black &>/dev/null; then
      black --quiet "$FILE" 2>/dev/null || true
    fi
    ;;
  ts|tsx|js|jsx|mjs|cjs)
    if command -v prettier &>/dev/null; then
      prettier --write --log-level silent "$FILE" 2>/dev/null || true
    fi
    ;;
  json)
    if command -v jq &>/dev/null; then
      TMP=$(mktemp)
      jq . "$FILE" > "$TMP" 2>/dev/null && mv "$TMP" "$FILE" || rm -f "$TMP"
    fi
    ;;
  go)
    if command -v gofmt &>/dev/null; then
      gofmt -w "$FILE" 2>/dev/null || true
    fi
    ;;
  rs)
    if command -v rustfmt &>/dev/null; then
      rustfmt --edition 2021 "$FILE" 2>/dev/null || true
    fi
    ;;
  sh|bash)
    if command -v shfmt &>/dev/null; then
      shfmt -w "$FILE" 2>/dev/null || true
    fi
    ;;
  rb)
    if command -v rubocop &>/dev/null; then
      rubocop --autocorrect --no-color --quiet "$FILE" 2>/dev/null || true
    fi
    ;;
  *)
    # Unknown extension — skip silently
    ;;
esac

exit 0
