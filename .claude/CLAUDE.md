@RTK.md

# Git Commits

- NEVER add Co-Authored-By lines to git commits
- NEVER add "Generated with Claude Code" or similar attribution lines in PRs, commits, or any output

# Python Standards

- Package manager: `uv` only — never `pip`, `python`, `python3` directly. Always `uv run <cmd>`, `uv add <pkg>`, `uv sync`
- Linter/formatter: `ruff` (lint + format + isort), line length 140, double quotes
- Type checker: `ty`
- Type hints required on all public functions and method signatures
- Pre-commit: run `uv run pre-commit run --all-files` before every commit
- Tests: `uv run pytest` — mock all LLM/external API calls
- Prefer classes over loose functions for complex/stateful logic

# Verification

- Before declaring work complete, run the project's test/lint commands if they exist
- If no test commands exist, at minimum verify edited files parse correctly

# Token Discipline

- **Graph first**: in repos with a code-review-graph MCP (e.g. vambe-datascience), ALWAYS try graph tools (`semantic_search_nodes`, `query_graph`, `get_impact_radius`, `get_architecture_overview`, `detect_changes`) BEFORE Grep/Glob/Read
- **No subagents for trivia**: PR body/title edits, commits, single-file fixes, doc tweaks, "what does X do" questions, `gh` operations — do these directly. Subagents only for real parallel research (3+ independent things), pre-merge review, or tasks >30 min
- **GitHub ops via `gh` CLI**: "actualiza el body de la PR" → `gh pr edit <N> --body`, never explore the repo for this
- **Explicit paths**: if the user says "mira el repo" / "lee el proyecto" / "investiga X", push back and ask for a specific file or dir before launching exploration
- **`/panel` only on specific paths**, never on a whole monorepo
- **Session budget**: at ~25-30 prompts or when switching topics, suggest `/clear`. One pipeline stage per session in staged architectures
- **Short prompt + non-trivial task = red flag**: before launching subagents, ask "¿querés que explore el repo o ya sabés qué archivo tocar?"
