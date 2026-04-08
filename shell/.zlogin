# Runs only on login shells (e.g. SSH). Auto-launches vambe-cli on remote sessions.
if [[ -n "$SSH_CONNECTION" && -f "$HOME/vambe-cli.js" ]]; then
  node "$HOME/vambe-cli.js"
  [ -t 0 ] && stty sane 2>/dev/null
fi
