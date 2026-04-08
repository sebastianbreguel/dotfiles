#!/bin/bash
# Workstation setup — wrapper for setup.sh (adaptive macOS/Linux).
# On Linux, GUI casks and macOS prefs are skipped automatically.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec bash "$SCRIPT_DIR/setup.sh" "$@"
