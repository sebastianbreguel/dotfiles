# RTK - Rust Token Killer

Hook auto-rewrites commands (`git status` → `rtk git status`, transparent, 0 overhead).

## Meta commands (invoke rtk directly, NOT via hook)

- `rtk gain` — savings analytics
- `rtk gain --history` — usage history with savings
- `rtk discover` — scan Claude Code history for missed opportunities
- `rtk proxy <cmd>` — raw passthrough, no filtering (debugging)
