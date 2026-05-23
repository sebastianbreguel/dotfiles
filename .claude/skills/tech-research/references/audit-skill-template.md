# Audit Skill Template (Companion)

This is the parametric template the main `tech-research` skill uses to write
the companion audit skill at `<out>/<slug>/audit-skill/SKILL.md`.

Substitute every `{{TOKEN}}` placeholder. Keep budget, privacy, and read-only
rules unchanged — they are load-bearing.

## Tokens to substitute

| Token             | Source                                                                              |
|-------------------|--------------------------------------------------------------------------------------|
| `{{TOPIC}}`       | The full topic string from the user.                                                |
| `{{SLUG}}`        | Lowercase hyphenated slug.                                                          |
| `{{DOCS_PATH}}`   | Absolute path to `<out>/<slug>/`.                                                   |
| `{{PRESET}}`      | Preset name from `dimension-presets.md`.                                            |
| `{{DIMENSIONS}}`  | Comma-separated dimension labels actually used (e.g., `tooling, runtime, security`).|
| `{{STACK_MARKERS}}` | Bullet list of stack-marker globs from the chosen preset.                         |
| `{{MECH_CHECKS}}` | Bullet list of mechanical checks distilled from `checklist.md` detection hints.     |
| `{{AGENT_TABLE}}` | Markdown table mapping each dimension to its preferred agent.                       |
| `{{TODAY}}`       | `YYYY-MM-DD` of generation.                                                         |

## Template body

```markdown
---
name: {{SLUG}}-audit
description: Audit a {{TOPIC}} repo against the practices reference at {{DOCS_PATH}}. Use when the user asks to "audit {{TOPIC}}", "review {{TOPIC}} practices", "check {{TOPIC}} code quality", or wants a health check of a {{TOPIC}} repo. Produces a scored AUDIT_REPORT.md with findings grouped by severity (blocker, major, minor) across the dimensions defined in the reference: {{DIMENSIONS}}.
---

# {{TOPIC}} Audit

Read-only audit of a {{TOPIC}} codebase against the reference at
`{{DOCS_PATH}}`. Produces a scored `AUDIT_REPORT.md` with findings grouped by
severity, dispatched in parallel across domain-expert agents and mechanical
checks.

Reference last refreshed: {{TODAY}}.

## When to invoke

Trigger on:
- "audit this {{TOPIC}} repo", "audit my {{TOPIC}} code"
- "review {{TOPIC}} best practices"
- "{{TOPIC}} code quality check", "{{TOPIC}} health check"
- "is this {{TOPIC}} project production-ready?"
- Explicit `/{{SLUG}}-audit` slash invocation.

Do NOT trigger on: single-file reviews, generic PR reviews, doc-only audits.

## Inputs

- **Target path** (default: `cwd`). User may pass a subdir.
- **Scope flags** (optional):
  - `--only=<dim>` — restrict to one dimension.
  - `--skip=<dim1,dim2>` — skip dimensions.
  - `--fast` — skip slow checks; <90s budget.
- If the target does not match {{TOPIC}} (no stack markers from the list
  below at depth ≤ 2), stop and tell the user. Do not audit a mismatched
  stack.

## Stack markers

The target qualifies as a {{TOPIC}} repo if it contains any of:

{{STACK_MARKERS}}

## MCP routing (mandatory)

This skill **MUST** route code exploration through MCP servers before
falling back to Grep/Glob/Read. Same routing as `/py-audit` and global
`mcp-routing.md`:

| Intent                              | Tool                                                          |
|-------------------------------------|---------------------------------------------------------------|
| Architecture / hubs / communities   | `mcp__code-review-graph__get_architecture_overview`, `list_communities`, `get_hub_nodes_tool` |
| Find symbols / nodes by keyword     | `mcp__code-review-graph__semantic_search_nodes_tool`          |
| Impact / blast radius               | `mcp__code-review-graph__get_impact_radius_tool`              |
| Affected execution paths            | `mcp__code-review-graph__get_affected_flows_tool`             |
| Callers/callees/imports/tests       | `mcp__code-review-graph__query_graph_tool` (patterns: callers_of, callees_of, imports_of, tests_for) |
| Dead code / large fns               | `mcp__code-review-graph__find_large_functions_tool`           |
| Locate symbol body                  | `mcp__serena__find_symbol` (`include_body=True`)              |
| Find references                     | `mcp__serena__find_referencing_symbols` (NEVER Grep for refs) |
| File outline                        | `mcp__serena__get_symbols_overview`                           |

**Prohibitions:**
- NEVER Grep for symbol refs → `find_referencing_symbols`.
- NEVER Read full file for one symbol → `find_symbol(include_body=True)`.
- NEVER use Grep/Glob for macro questions (modules, hubs, flows) → graph.
- Grep IS still allowed for the **mechanical check battery** in Phase 3 —
  textual patterns and JSON shape probes, not symbol queries.

## Protocol — 7 phases

### Phase 0 — MCP bootstrap (<10s)

1. `mcp__serena__activate_project` with `project="."` (silent, read-only).
2. `mcp__code-review-graph__list_graph_stats_tool` — check graph exists +
   freshness.
3. If graph missing or `last_updated` >7 days: ask user once
   `"graph stale/missing — rebuild before audit? (y/n)"`. On `y` →
   `build_or_update_graph_tool`. On `n` → continue, note in report
   header `_(graph stale: N days, results may miss recent changes)_`.
4. If MCPs unreachable → fall back to Grep/Glob/Read and note in report
   header `_(MCP unavailable, fallback to file scanning)_`.

### Phase 1 — Orient (read-only, <30s)

1. Read top-level manifests / lockfiles / configs (see stack markers above).
2. Detect actual versions and pinned major libraries.
3. **Architecture snapshot via graph**:
   - `get_architecture_overview` → top-level structure.
   - `list_communities` → module clusters.
   - `get_hub_nodes_tool` → high-fan-in symbols (review hot spots).
   - `find_large_functions_tool` → complexity outliers.
   Cache results — agents reuse them in Phase 2.
4. Emit a 1-paragraph stack summary to chat (3–5 lines: language/runtime
   versions, key libs, plus 1 line on architecture: N communities, top
   hubs).

### Phase 2 — Parallel domain dispatch

Dispatch agents in ONE message via multiple Agent calls. Fire only those whose
dimension applies to the detected stack:

{{AGENT_TABLE}}

Agent brief (identical per agent):

> Audit `<path>` for `<dimension>` against `{{DOCS_PATH}}/best-practices.md`
> and the cited research files. Return findings in this format:
> `[SEVERITY] file:line — issue — fix — impact=<H|M|L> — effort=<H|M|L>`.
> Severities: **BLOCKER** (security, data loss, prod-breaking, known CVE),
> **MAJOR** (architectural debt, perf, bug risk), **MINOR** (style,
> hygiene). **Impact**: H=blast radius wide / data-at-risk / prod outage;
> M=single module degradation; L=local hygiene. **Effort**: H=>1d /
> cross-module; M=hours / single module; L=<1h / single file.
>
> **MCP routing (mandatory):** use `mcp__code-review-graph__*` for
> architecture/impact/flows/hub queries and `mcp__serena__*` for symbol
> lookups + references. Specifically:
> - `semantic_search_nodes_tool` to locate domain-relevant code.
> - `get_impact_radius_tool` before flagging risky changes.
> - `query_graph_tool` (pattern=`tests_for`) to verify coverage claims.
> - `find_referencing_symbols` instead of Grep for callers.
> - `get_symbols_overview` instead of Read for file outlines.
> Fall back to Grep/Read only if MCP returns empty.
>
> Architecture snapshot already gathered in Phase 1 (communities, hubs,
> large fns) — agent receives it in CONTEXT to avoid re-querying.
>
> Max 25 findings; prioritize blockers. Include 3 wins. Return under 400
> words. Do not edit files.

If an agent returns >25 findings, keep blockers + top majors by file
recurrence; drop the rest with `(N findings truncated)`.

### Phase 3 — Mechanical checks

Run the checks distilled from `{{DOCS_PATH}}/checklist.md` detection
hints. These are textual / JSON shape probes — Grep, `rg`, `jq`, `curl`
are appropriate here, not MCP:

{{MECH_CHECKS}}

Capture output. For each check, emit `{check, severity, file?, line?, snippet?}`
records. Filter noise: count-only for high-volume linters, head -30 for
type-checker spew.

### Phase 4 — Consolidate + verify (100% ground-truth)

1. Key findings by `(file, line, rule)` tuple. Deduplicate.
2. If grep and agent both flag the same line, keep the agent's phrasing.
3. Rank within severity by file recurrence, then path.
4. Cap totals: 15 blockers, 25 majors, 20 minors. Note truncation if hit.
5. **100% verification (mandatory).** Every finding that survives dedupe
   MUST be ground-truthed before it lands in the report. Drop any finding
   that fails verification — no speculation, no "likely". For each finding:
   - Confirm `file:line` exists and the cited code is actually present
     (`mcp__serena__find_symbol(include_body=True)` or read exact line
     range). Reject if symbol/line drifted.
   - Confirm the claim with a primary source: graph query result, grep
     hit (paste the matched line), test output, or tool exit code.
     Findings without a quotable artifact are dropped.
   - Re-run the underlying check if the report cites tool output. Cache
     the run id / timestamp.
   - Cross-check `impact` against `get_impact_radius_tool` for the
     symbol; downgrade if blast radius is narrower than the agent
     claimed.
   - Mark each surviving finding with `verified=<source>` internally
     (graph|serena|grep|tool) — drives the `Evidence` column in Phase 6.

### Phase 5 — Score

Compute per-dimension score (0 to weight). Skip non-applicable dimensions and
redistribute their weight pro rata.

| Dimension | Weight | Checks (from checklist.md) |
|-----------|--------|----------------------------|
| _filled per dimension; weights sum to 100; default 100/N_ |

Deduct per finding: BLOCKER -3 from its dimension, MAJOR -1, MINOR -0.25
(floor at 0). Final score = `100 * sum(scores) / sum(applicable weights)`.

### Phase 6 — Report

Write `AUDIT_REPORT.md` at the target root using this template:

```markdown
# {{TOPIC}} Audit — <YYYY-MM-DD>
Target: <absolute path>
Reference: {{DOCS_PATH}}
Overall score: <N>/100

## Stack detected
<paragraph; include 1 line on architecture: N communities, top hubs>

## Scores by dimension
| Dimension | Score | Weight | Notes |

## Blockers (must fix before prod)
- [BLOCKER] file:line — issue — fix

## Major findings
- [MAJOR] ...

## Minor / hygiene
- [MINOR] ...

## Wins
- ...

## All findings (verified)
Every row = 1 finding, 100% ground-truthed in Phase 4. `Evidence` cites
the source artifact (graph node, serena symbol, grep match, tool run).
Sort: severity (BLOCKER → MAJOR → MINOR), then impact desc, then effort asc.

| # | Severity | Dimension | File:line | Issue | Fix | Impact | Effort | Evidence |
|---|----------|-----------|-----------|-------|-----|--------|--------|----------|

## Quick-fix plan (top 5, ordered by ROI)
ROI = impact / effort. Pick from the verified table only.
1. ...
```

If `AUDIT_REPORT.md` exists, overwrite (idempotent).

## Output to user (chat)

Print only:
- Overall score.
- Top 3 blockers (one line each).
- Absolute path to `AUDIT_REPORT.md`.

Do not dump the full report into chat.

## Rules

- **READ-ONLY.** Never edit user code. Only `AUDIT_REPORT.md` is written.
- **Idempotent.** Same inputs → same report (modulo timestamp).
- **100% verified.** Every row in the final findings table MUST have an
  `Evidence` cell pointing to a real artifact (graph node id, serena
  symbol path, grep matched line, tool exit + run id). Unverifiable
  findings get dropped, not downgraded. Speculation (`likely`,
  `probably`, `may be`) is a hard reject in Phase 4.
- **MCP-first.** Phase 0 + Phase 1 architecture queries go through
  `code-review-graph` and `serena`. Grep/Read only for the mechanical
  check battery in Phase 3 or when MCP returns empty.
- **Missing tools**: note + skip. Do not install tools. If MCPs
  unreachable → degrade gracefully + flag in report header.
- **Budget**: 4 minutes wall-clock total. Past that, cut scope and add
  `_(scope reduced)_` to the report header.
- **Privacy**: file:line + 1-line excerpt max. Never paste 5+ lines.
- **Reference drift**: if `{{DOCS_PATH}}` is missing, halt and tell the user
  to refresh via `tech-research` for `{{TOPIC}}`.
```

## Notes for the generator

- Keep the produced audit skill under 250 lines. The reference docs hold the
  detail; the audit skill is a runner.
- If `{{MECH_CHECKS}}` ends up empty, the produced audit is mostly agent-driven —
  that is acceptable, but flag it to the user in Phase 6 of `tech-research` so
  they know the audit will be slower and less deterministic.
- Make sure the audit skill's `name` field matches the directory name; harness
  routing depends on it.
- The audit skill does not need its own `references/` folder; it points at the
  produced `{{DOCS_PATH}}` for everything.
