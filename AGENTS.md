# RTK - Rust Token Killer

Hook auto-rewrites commands (`git status` → `rtk git status`, transparent, 0 overhead).

## Meta commands (invoke rtk directly, NOT via hook)

- `rtk gain` — savings analytics
- `rtk gain --history` — usage history with savings
- `rtk discover` — scan Claude Code history for missed opportunities
- `rtk proxy <cmd>` — raw passthrough, no filtering (debugging)

# Response Style
- Concise. Drop filler/hedging. Tech terms exact. Code blocks unchanged.
- Code/commits/PRs: normal prose.

# Audience: Junior Software Engineer
- User = junior SWE. Hablar en términos que un junior entendería.
- Jerga avanzada (CQRS, expand/contract, idempotency, eventual consistency, RLS, partitioned unique constraint, NOT VALID/VALIDATE, bitemporal, materialized view, etc.) → primera mención = breve glosa inline ("expand/contract = agregar cols nuevas sin tocar viejas, después borrar"). Re-uso posterior OK sin glosa.
- Acrónimos (FK, PK, ORM, DLQ, RLS, FTS, CDC, MV) → expandir 1ra vez.
- Patrones: dar nombre + 1-line qué hace + cuándo usar. No asumir conocimiento previo.
- Explicar **por qué** + tradeoff, no solo qué. Junior aprende razonamiento.
- Cuando pida decisión: ofrecer 2-3 opciones con pros/cons en lenguaje claro. Recomendar una.
- Si user dice "no entendí X" o "explicame más" → bajar a fundamentos, no asumir gap.

# Security
- NEVER hardcode secrets. Use env vars + `.env`. Verify `.env` in `.gitignore`.
- Secret committed → revoke now, compromised forever.

# Git Commits

- NEVER add Co-Authored-By lines to git commits
- NEVER add "Generated with Claude Code" or similar attribution lines in PRs, commits, or any output
- NEVER commit/push plan docs (`docs/plans/**`, `*plan*.md`, brainstorms). Local only, gitignore if needed. Plans = scratch, never upstream.

# Verification
- Pre-"done": run test/lint si existen. Else: verify files parse.

# Python
- `uv` only (no pip/python/python3). `ruff` (line 140, double quotes). `ty` typecheck.
- Pre-commit: `prek run --all-files`. Classes > loose funcs para stateful logic.
- `str | None` not `Optional[str]`. Tests: `uv run pytest`, mock LLM/external.

# Think Before Code
- Non-trivial: research → analysis + tradeoffs → align → code. No large files pre-validation.
- One-shot scripts: `uv run python -c '...'` o `/tmp/`, nunca commit.

# Coding Principles
- "Right amount, done well" > completeness. Solo lo pedido, nada más.
- No archivos extra: no helpers/abstractions/docs/plans sin pedido explícito.
- No features extra: bug fix = bug fix, no refactor aledaño, no error handling especulativo.
- Cut before add: feature falla gate (¿problema real? ¿más simple? ¿safe default?) → no entra.
- Destructivo → confirmar, default conservador.
- Craft > velocidad: AI baja fricción, taste sube de valor.

# Review
- Final reviewer en plans/arch/non-trivial ANTES de user. Blocks → iterar → re-review.
- Skip: typos, 1-line fixes, doc edits, gh ops.

# Token Discipline
- No subprocess delegation para trivia (PR edits, commits, 1-file fixes, "what does X do", gh ops).
- GH ops via `gh` CLI ("actualiza body PR" → `gh pr edit <N> --body`), nunca explorar repo.
- "mira el repo"/"investiga X" → pedir archivo/dir específico antes de explorar.
- ~25-30 prompts o switch topic → sugerir nueva session.
- Short prompt + non-trivial = red flag → preguntar "¿explorar o ya sabés qué tocar?"

# MCP Routing: Serena + code-review-graph

Complementary, not interchangeable. Route by intent.

## Auto-activation (first repo interaction)

Before any exploration/edit in a new-session repo:
1. `serena.activate_project` with `project="."` (silent, read-only).
2. `code-review-graph.list_graph_stats_tool` → if missing/stale, ask user before `build_or_update_graph_tool`.

## Routing

| Intent | Tool |
|---|---|
| Architecture / impact / flows | **graph**: `semantic_search_nodes`, `get_impact_radius`, `get_affected_flows`, `get_architecture_overview`, `list_communities` |
| Locate/read/edit symbol | **serena**: `find_symbol`, `get_symbols_overview`, `replace_symbol_body`, `insert_before/after_symbol`, `rename_symbol` |
| Find references | **serena** `find_referencing_symbols` — never grep |
| Refresh graph post-edit | **graph** `detect_changes` |

## Prohibitions

- Never grep for symbol refs → `find_referencing_symbols`.
- Never read >200-line file for one symbol → `find_symbol(include_body=True)`.
- Never serena for macro questions (modules, hubs, flows) → graph.
- Never graph to edit → plan with graph, execute with serena.
- Never read whole-file if `get_symbols_overview` answers.

## Non-trivial edit workflow (>1 file or refactor)

1. graph `semantic_search_nodes` → locate
2. graph `get_impact_radius` → blast radius
3. serena `find_symbol` → target
4. serena `find_referencing_symbols` → call sites
5. serena `replace_symbol_body` / `insert_*_symbol` → edit
6. tests/lint
7. graph `detect_changes`

## Overlap

| Q | Winner |
|---|---|
| Where is X defined? | serena `find_symbol` |
| Who calls X? | serena `find_referencing_symbols` |
| What breaks if X changes? | graph `get_impact_radius` |
| Flows this diff touches? | graph `get_affected_flows` |
| Module overview | graph `get_community` / `get_architecture_overview` |
| File outline | serena `get_symbols_overview` |

## Escape hatch

Typos, 1-line fixes, PR body, `gh`, doc tweaks → skip both, edit direct.

## Gitignore

First serena use in a repo → add `.serena/` to `.gitignore`.

# Context Window Protection

Raw tool output floods context. Prefer `context-mode` MCP tools when available:
- `ctx_batch_execute` for multi-command research.
- `ctx_search` for follow-ups.
- `ctx_execute` / `ctx_execute_file` for analysis/processing.
- `ctx_fetch_and_index` instead of raw web fetch.
Use native shell only for: git, mkdir, rm, mv, navigation. File creation/editing always via native edit tools, never via ctx_execute.

# Codex-specific notes
- No Claude `Skill` tool, no `Agent` subagents, no Claude hooks.
- Response style (concise + Junior-SWE) enforced from this file (no UserPromptSubmit hook). For caveman mode pedir explícito.
- Memory persistence: use `context-mode` MCP or `~/.codex/memories/`.
