#!/usr/bin/env bash
# SessionEnd hook: export every Claude transcript into a HyperFrames-ready project.
# Non-blocking by design: failures are logged and never interrupt Claude shutdown.

set -euo pipefail

ENABLED_RAW="${CLAUDE_HYPERFRAMES_ENABLE:-1}"
ENABLED="$(printf "%s" "$ENABLED_RAW" | tr '[:upper:]' '[:lower:]')"
case "$ENABLED" in
  0|false|off|no)
    exit 0
    ;;
esac

if ! command -v node >/dev/null 2>&1; then
  exit 0
fi

SCRIPT_PATH="${CLAUDE_HYPERFRAMES_EXPORT_SCRIPT:-$HOME/.claude/hooks/claude-hyperframes-export.mjs}"
if [ ! -f "$SCRIPT_PATH" ]; then
  exit 0
fi

INPUT_FILE="$(mktemp)"
LOG_DIR="${CLAUDE_HYPERFRAMES_LOG_DIR:-$HOME/.claude/hyperframes/logs}"
LOG_FILE="$LOG_DIR/session-end.log"

mkdir -p "$LOG_DIR"
cat > "$INPUT_FILE"

{
  echo "----"
  date "+%Y-%m-%d %H:%M:%S"
  node "$SCRIPT_PATH" --hook-input "$INPUT_FILE"
} >> "$LOG_FILE" 2>&1 || true

rm -f "$INPUT_FILE"
exit 0
