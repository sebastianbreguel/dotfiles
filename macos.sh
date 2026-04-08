#!/bin/bash
# macOS system preferences
# Run once after a fresh install. Requires logout/restart for some settings to apply.

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "macos.sh: not macOS, skipping."
  exit 0
fi

echo "Applying macOS preferences..."

# Close System Preferences to avoid conflicts
osascript -e 'tell application "System Preferences" to quit' 2>/dev/null || true

# --- Dock ---
defaults write com.apple.dock autohide -bool true       # Auto-hide dock
defaults write com.apple.dock tilesize -int 128          # Large icons

# --- Keyboard ---
# (KeyRepeat and InitialKeyRepeat are at system defaults — adjust here if needed)

# Restart affected apps
killall Dock 2>/dev/null || true

echo "Done. Some changes require logout to take effect."
