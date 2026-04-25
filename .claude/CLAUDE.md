@RTK.md

# Response Style
- Caveman full desde msg 1 (skill `caveman:caveman`). Drop articles/filler/hedging. Fragments OK. Tech terms exact. Code blocks unchanged.
- Drop caveman: security warnings, irreversible confirms, multi-step seqs, user confused. Resume after.
- Code/commits/PRs: normal prose.
- "stop caveman" / "normal mode" → revert.

# Security
- NEVER hardcode secrets. Use env vars + `.env`. Verify `.env` in `.gitignore`.
- Secret committed → revoke now, compromised forever.

# Git Commits

- NEVER add Co-Authored-By lines to git commits
- NEVER add "Generated with Claude Code" or similar attribution lines in PRs, commits, or any output

# Verification
- Pre-"done": run test/lint si existen. Else: verify files parse.

# Python
- `uv` only (no pip/python/python3). `ruff` (line 140, double quotes). `ty` typecheck.
- Pre-commit: `uv run pre-commit run --all-files`. Classes > loose funcs para stateful logic.
- `str | None` not `Optional[str]`. Tests: `uv run pytest`, mock LLM/external.

# Think Before Code
- Non-trivial: research → analysis + tradeoffs → align → code. No large files pre-validation.
- One-shot scripts: `uv run python -c '...'` o `/tmp/`, nunca commit.

# Review
- `tech-lead` = final reviewer en plans/arch/non-trivial ANTES de user. Blocks → iterar → re-review.
- Skip: typos, 1-line fixes, doc edits, gh ops.

# Token Discipline
- No subagents para trivia (PR edits, commits, 1-file fixes, "what does X do", gh ops). Subagents solo: 3+ parallel research, pre-merge review, >30min.
- GH ops via `gh` CLI ("actualiza body PR" → `gh pr edit <N> --body`), nunca explorar repo.
- "mira el repo"/"investiga X" → pedir archivo/dir específico antes de explorar.
- `/panel` solo paths específicos, nunca monorepo.
- ~25-30 prompts o switch topic → sugerir `/clear`.
- Short prompt + non-trivial = red flag → preguntar "¿explorar o ya sabés qué tocar?"

# MCP Routing
- Real code work (refactors, multi-file, symbol lookups, impact) → load `@rules/mcp-routing.md`. Skip trivia.
