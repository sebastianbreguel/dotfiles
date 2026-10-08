# Shared Claude-first instructions

Read `/Users/sebabreguel/.claude/CLAUDE.md` at session start and follow its current shared rules. This is the canonical source for style, coding principles and workflow; do not maintain a second copy here. Repository and higher-priority instructions still apply.

## Codex compatibility
- Use native Codex tools. Claude `Skill`, `Agent`, `Read`, `Bash` and `WebFetch` names mean the corresponding available capability, not invented tools. Claude hooks do not run merely because a skill names them.
- Skill `allowed-tools` fields are guidance, not enforced Codex permissions; current sandbox and approvals remain authoritative. `argument-hint` is help text. `$ARGUMENTS` means the user's actual supplied arguments, never literal shell expansion. Resolve relative skill resources from the skill directory, not the project directory.
- Shared skills live in `/Users/sebabreguel/.agents/skills`; linked workflow directories use the current Claude originals. Native role TOMLs are reviewed snapshots; refresh via the official migrate-to-codex skill in a temporary target after editing the Claude role. Never run the migrator directly over HOME or through symlinked destinations.
- For repositories under `/Users/sebabreguel/vambe/`, read `/Users/sebabreguel/vambe/AGENTS.md` and its canonical workspace source even if Git-root discovery does not include the workspace parent directory.
- Claude agent color and automatic memory metadata are not imported. Use available Engram tools explicitly; never assume a Claude memory hook ran.
- For session transfer, read `/Users/sebabreguel/.claude/skills/handoff/SKILL.md`. Pause the source agent before editing from the destination. Transfer task context, not permissions, credentials or running processes.

## Retained local safeguards
- Python: use `uv` only; run Python examples as `uv run python`, including shared skills showing bare Python. Ruff: line length 140, double quotes; `ty` for typecheck; `uv run pytest` with external services mocked. `str | None`, not `Optional[str]`. Stateful logic may use classes. Pre-commit: `prek run --all-files`.
- Before claiming completion, run relevant tests, lint and typecheck when available; otherwise inspect/parse changed files. Report unavailable or failing checks explicitly. Before PR merge, check CI and Knip when available.
- First Serena use in a repository: keep `.serena/` gitignored. Routing comes from the canonical Claude rules, not the retired graph-first policy.
- RTK diagnostics remain available through `rtk gain`, `rtk gain --history`, `rtk discover` and `rtk proxy <cmd>`. Do not assume a Claude rewrite hook is active in Codex.
- Caveman mode only when explicitly requested.
