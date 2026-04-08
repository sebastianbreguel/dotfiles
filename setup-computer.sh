#!/bin/bash
# macOS workstation setup — wrapper for setup.sh
# Use setup-server.sh for headless Linux servers.
set -e

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "ERROR: setup-computer.sh targets macOS. Use setup-server.sh on Linux."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec bash "$SCRIPT_DIR/setup.sh" "$@"
