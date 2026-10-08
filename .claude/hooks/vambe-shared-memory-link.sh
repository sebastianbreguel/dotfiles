#!/bin/bash
# Every project under ~/vambe shares one auto-memory: point its memory dir at the shared one.
# Claude Code may key memory by the launch dir or by the git root, so both get linked.
shared="$HOME/.claude/vambe-shared-memory"
launch_dir="${CLAUDE_PROJECT_DIR:-$PWD}"

link_project() {
  case "$1" in "$HOME/vambe" | "$HOME/vambe/"*) ;; *) return ;; esac
  local project_dir="$HOME/.claude/projects/$(printf '%s' "$1" | sed 's/[^A-Za-z0-9]/-/g')"
  [ -L "$project_dir/memory" ] && return
  mkdir -p "$project_dir"
  # A memory that grew before the link existed is kept aside, never deleted.
  [ -e "$project_dir/memory" ] && mv "$project_dir/memory" "$HOME/.claude/backups/memory-unlinked-$(basename "$project_dir")-$(date +%s)"
  ln -s "$shared" "$project_dir/memory"
}

link_project "$launch_dir"
link_project "$(git -C "$launch_dir" rev-parse --show-toplevel 2>/dev/null)"
exit 0
