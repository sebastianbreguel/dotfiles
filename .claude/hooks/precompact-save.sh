#!/usr/bin/env bash
# PreCompact hook — saves session state before context compaction.
# Claude can read ~/.claude/session-env/precompact-last.md after compaction
# to recover context about what was happening.

set -euo pipefail

INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TRIGGER=$(echo "$INPUT" | jq -r '.trigger // "unknown"')
CWD=$(pwd)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SAVE_DIR="$HOME/.claude/session-env"
SAVE_FILE="$SAVE_DIR/precompact-last.md"

mkdir -p "$SAVE_DIR"

# Gather git context if available
GIT_BRANCH=""
GIT_STATUS=""
if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  DIRTY_COUNT=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  if [ "$DIRTY_COUNT" -gt 0 ]; then
    GIT_STATUS="$DIRTY_COUNT file(s) with uncommitted changes"
  else
    GIT_STATUS="clean"
  fi
fi

cat > "$SAVE_FILE" <<EOF
# Pre-Compact Snapshot

**Saved:** $TIMESTAMP
**Session:** $SESSION_ID
**Trigger:** $TRIGGER
**Working directory:** $CWD
EOF

if [ -n "$GIT_BRANCH" ]; then
  cat >> "$SAVE_FILE" <<EOF
**Git branch:** $GIT_BRANCH
**Git status:** $GIT_STATUS
EOF
fi

cat >> "$SAVE_FILE" <<EOF

---
*Context was compacted. Check git status and recent files to re-orient.*
EOF

# Also write session-specific file for history
HISTORY_FILE="$SAVE_DIR/precompact-$(echo "$SESSION_ID" | cut -c1-8)-${TIMESTAMP// /_}.md"
cp "$SAVE_FILE" "$HISTORY_FILE" 2>/dev/null || true

exit 0
