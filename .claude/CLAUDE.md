@RTK.md

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
- SQL/migrations/Alembic/async/pgvector/asyncpg: mostrar código exacto + comentar líneas no-obvias.
- Si user dice "no entendí X" o "explicame más" → bajar a fundamentos, no asumir gap.

# Security
- NEVER hardcode secrets. Use env vars + `.env`. Verify `.env` in `.gitignore`.
- Secret committed → revoke now, compromised forever.

# Git Commits

- NEVER add Co-Authored-By lines to git commits
- NEVER add "Generated with Claude Code" or similar attribution lines in PRs, commits, or any output
- NEVER commit/push plan docs (`docs/plans/**`, `*plan*.md` from /ce-plan, brainstorms). Local only, gitignore if needed. Plans = scratch, never upstream.

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

# Engram — Persistent Memory
Engram = persistent memory via MCP (SQLite + FTS5). Tools prefixed with `mem_`.

## When to save (mem_save)
Call IMMEDIATELY after:
- Bug fix completed
- Architecture or design decision made
- Non-obvious codebase discovery
- Config change or environment setup
- Pattern established (naming, structure, convention)
- User preference or constraint learned

Format: title = "Verb + what", short and searchable (e.g. "Fixed N+1 in UserList", "Chose Zustand over Redux"). type = `bugfix` | `decision` | `architecture` | `discovery` | `pattern` | `config` | `preference`. scope = `project` (default) | `personal`.

## When to search
- **Reactive**: user says "remember", "recall", "what did we do", "how did we solve" → `mem_context` first (fast), then `mem_search` if not found, then `mem_get_observation` for full content.
- **Proactive**: starting work that might overlap with past sessions, or topic with no context → search engram before starting.

## Session close (mandatory)
Before ending session or saying "done", call `mem_session_summary` with: Goal, Decisions, Discoveries, Accomplished, Next Steps, Relevant Files.

## Post-compaction
On compaction or context reset: 1) `mem_session_summary` with compacted content, 2) `mem_context` to recover prior context, 3) only then continue working.
