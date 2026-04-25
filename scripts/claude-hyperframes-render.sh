#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${CLAUDE_HYPERFRAMES_OUT_DIR:-$HOME/.claude/hyperframes}"
PROJECTS_DIR="$ROOT_DIR/projects"

if [ ! -d "$PROJECTS_DIR" ]; then
  echo "No projects found in $PROJECTS_DIR"
  exit 1
fi

TARGET="${1:-latest}"

if [ "$TARGET" = "latest" ]; then
  PROJECT_DIR="$(ls -dt "$PROJECTS_DIR"/* 2>/dev/null | head -1 || true)"
else
  PROJECT_DIR="$PROJECTS_DIR/$TARGET"
fi

if [ -z "${PROJECT_DIR:-}" ] || [ ! -d "$PROJECT_DIR" ]; then
  echo "Project not found: $TARGET"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/index.html" ]; then
  echo "index.html missing in $PROJECT_DIR"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

OUTPUT_PATH="${2:-$PROJECT_DIR/output.mp4}"

echo "Rendering project: $PROJECT_DIR"
echo "Output: $OUTPUT_PATH"

if [ "${CLAUDE_HYPERFRAMES_DRY_RUN:-0}" = "1" ]; then
  echo "[dry-run] cd \"$PROJECT_DIR\" && npx hyperframes render --output \"$OUTPUT_PATH\""
  exit 0
fi

(
  cd "$PROJECT_DIR"
  npx hyperframes render --output "$OUTPUT_PATH"
)

echo "Done: $OUTPUT_PATH"
