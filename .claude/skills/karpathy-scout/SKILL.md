---
name: karpathy-scout
description: "Analyze the current project (cwd) through Andrej Karpathy's lens — compression > addition, dependencies bad bad bad, first-order terms, calculator test — and produce a ranked table of contribution opportunities biased ~70/30 toward deletion/simplification over feature addition. Each row carries four scores: Karpathy (philosophy alignment), Maintainer (likelihood the project owner accepts it), Impact (High/Medium/Low via get_impact_radius), Effort (S/M/L/XL). Indexes code with code-review-graph + serena before pulling git/gh signals. Use whenever the user wants to know what to ship next on their own repo, what to delete, what bloat to compress, or what feels off about the codebase. Triggers: 'karpathy scout', 'what should I cut', 'what would karpathy delete here', 'find bloat in this project', 'simplify proposals', 'compress this repo', 'first-order proposals', 'review my project karpathy'."
---

# karpathy-scout

you are scouting the **current project** through karpathy's lens. the move is not "what feature should we add". the move is "what would karpathy *delete*, *compress*, or *flatten* — and what's the actual first-order term we're avoiding by adding ceremony instead?"

> "if i can't build it, i don't understand it." — every proposal must clarify the load-bearing structure, never bury it deeper.
> "dependencies bad bad bad."
> "i cannot simplify this any further." ← that's the goal state.

this is the inward-facing twin of `repo-scout`. same `code-review-graph` + `serena` infra. inverted bias: subtraction over addition, compression over feature work. ~70% of proposals should be of the form *delete X*, *compress N lines → N/2*, *drop dep*, *flatten abstraction*. ~30% may be additive — but only when a first-order term is missing.

**deletion and addition are not exclusive.** the highest-karpathy proposals are *compressive-adds*: a new feature that also deletes ≥ as much code as it adds, or unlocks a deletion path. tag those `compressive-add` and rank them above pure-add proposals. example: ship a 50-line micro-tool that replaces a 200-line manual flow → net −150 LOC + new capability. counts toward the 70% subtractive floor, not the 30% additive ceiling.

## scope

- target = **current working directory only**. no path arg. if user wants another repo, that's `repo-scout`.
- read-only. this skill never edits code; it produces a markdown report.

## outputs

a single markdown file `karpathy-scout-<owner>-<repo>.md` (slugged) in cwd, structured as:

1. **shape & vibe** — language, line count, dependency footprint, ceremony density
2. **karpathy diagnostic** — what would karpathy say in 60 seconds of looking at this?
3. **owner/maintainer profile** — what gets merged here historically (informs Maintainer Score)
4. **the table** — single ranked opportunity table, four scores per row
5. **per-opportunity detail** — anchor symbols, impact radius, e2e test plan

inline summary at end of run: 3 lines (one-line diagnostic, top-3 by combined rank, file path).

## execution order (strict)

```
step 0  shape — language, deps, line counts, ceremony scan
step 1  index — code-review-graph + serena (REQUIRED, do not skip)
step 2  signals — git log + gh issues/PRs (lighter than repo-scout, just enough for Maintainer Score)
step 3  karpathy lens scan — generate raw proposal pool through 9 filters
step 4  maintainer alignment — score each proposal against owner patterns
step 5  rank & write — single table, four scores, sorted by combined rank
```

do not skip step 1. without the graph, "compress this hub" and "this dep is unused" are both blind guesses. with the graph, blast radius and dependency edges are facts.

## step 0: shape & vibe

```bash
# repo identity
git remote get-url origin 2>/dev/null
git log --oneline | wc -l
git log --oneline --since="6 months ago" | wc -l

# line / file counts — prefer tokei
tokei . 2>/dev/null || cloc . --quiet 2>/dev/null

# dependency footprint (per language)
cat package.json 2>/dev/null | jq '.dependencies, .devDependencies' 2>/dev/null
cat pyproject.toml 2>/dev/null | grep -A 200 "dependencies"
cat go.mod 2>/dev/null
cat Cargo.toml 2>/dev/null

# ceremony scan — fast karpathy smell test
grep -rE "^import |^from " --include="*.py" . 2>/dev/null | wc -l
grep -rE "argparse|hydra|click|typer|pydantic\.BaseModel" --include="*.py" . 2>/dev/null | wc -l
grep -rE "try:|except " --include="*.py" . 2>/dev/null | wc -l
grep -rE "^class .*ABC|abstractmethod|FactoryProvider|Manager\b|Strategy\b" --include="*.py" . 2>/dev/null | head -20
grep -rE "logging\.(getLogger|info|debug|warning)" --include="*.py" . 2>/dev/null | wc -l
grep -rE "@dataclass|TypedDict|Protocol" --include="*.py" . 2>/dev/null | wc -l
```

record:
- **dep count** — per package manager. raw number, no judgment yet
- **lines per file** — top 10 largest. anything > 500 is a candidate
- **ceremony density** — argparse/hydra/click hits per 1000 LOC, try/except per 1000 LOC, abstract-class hits, logging-module usage
- **import depth** — does the codebase favor a few imports or many?

these numbers anchor the karpathy diagnostic in step 3.

## step 1: index (REQUIRED)

same routine as `repo-scout`, no shortcuts.

### 1a. activate serena, build the graph

```
mcp__serena__activate_project        project="."
mcp__code-review-graph__list_graph_stats_tool
```

build policy — do not ask:
- `total_nodes == 0` or `last_updated == null` → `mcp__code-review-graph__build_or_update_graph_tool full_rebuild=True postprocess="full"`
- graph older than HEAD → `detect_changes_tool` then `build_or_update_graph_tool` (incremental)
- fresh → skip to 1b

if build fails (parse error, language unsupported), surface and stop. do not continue with an empty graph.

### 1b. macro structure (graph)

| goal | tool |
|---|---|
| architecture overview | `get_architecture_overview_tool` |
| modules / communities | `list_communities_tool`, `get_community_tool` |
| hubs (most-depended-on symbols) | `get_hub_nodes_tool` |
| bridges (subsystem connectors) | `get_bridge_nodes_tool` |
| named user-visible flows | `list_flows_tool`, `get_flow_tool` |
| **large functions (compression candidates)** | `find_large_functions_tool` |
| **knowledge gaps (undocumented hubs)** | `get_knowledge_gaps_tool` |
| surprising couplings | `get_surprising_connections_tool` |

bold rows feed deletion/compression proposals directly. record top 5 hubs, top 5 large functions, every bridge node, and every named flow.

### 1c. symbol-level grounding (serena)

for each candidate area:
- `get_symbols_overview` → outline
- `find_symbol` (`include_body=True` only when needed)
- `find_referencing_symbols` → call sites. **never grep for refs.**

read-only. step 1 does not edit anything.

### 1d. impact radius preflight

for every candidate area you may recommend in step 5:

```
mcp__code-review-graph__get_impact_radius_tool      node=<symbol/module>
mcp__code-review-graph__get_affected_flows_tool     node=<symbol/module>
```

save radius (number of nodes affected) + flows touched. feeds `Impact` column and the e2e test plan in step 5.

## step 2: signals (lighter than repo-scout)

inward-facing scout doesn't need 50+ PRs. it needs *just enough* to estimate Maintainer Score and avoid collisions.

```bash
# what gets merged — last 6 months of merged PRs
gh pr list --state merged --limit 30 --json title,labels,files,additions,deletions,author,mergedAt 2>/dev/null

# what gets rejected
gh pr list --state closed --limit 15 --json title,labels,closedAt --search "is:unmerged" 2>/dev/null

# open PRs — collision detection
gh pr list --state open --limit 20 --json title,labels,files,author 2>/dev/null

# active issues
gh issue list --state open --limit 30 --json title,labels,createdAt,author 2>/dev/null

# direct commits — small repos / personal projects
git shortlog -sn --no-merges --since="6 months ago" | head -10
git log --oneline --since="3 months ago" --stat | head -100
```

if the repo has < 5 PRs, fall back to direct-commit pattern (owner's own commit messages reveal what they care about). lower confidence + say so explicitly.

process gh JSON with `ctx_execute` or inline scripts. **never dump raw JSON into context.**

extract:
- **owner's accepted-PR pattern** — feature/fix/docs/refactor/delete? avg lines? small or large PRs?
- **rejected patterns** — scope creep, off-roadmap, no tests, style mismatch
- **stated direction** — README, CLAUDE.md, docs/, milestones, roadmap labels
- **hot zones / cold zones** — by file churn from `git log --stat`
- **WIP** — themes covered by open PRs (so we don't double-propose)

## step 3: karpathy lens scan

generate the raw proposal pool by running each candidate area through these nine filters. **a proposal must clear at least one filter to be listed.** the more filters it satisfies, the higher its Karpathy Score.

### the nine filters

1. **compression test** — same behavior, fewer lines? shrink an N-line function/file/module to N/2 with no behavior change → propose. highest karpathy weight.
2. **dependency removal** — drop an import. either delete the dep entirely (unused), inline a 30-line equivalent, or replace a 500-pound dep with `stdlib + 50 lines`. cite specific dep + rationale.
3. **ceremony removal** — argparse → bare module-level vars (Poor Man's Configurator), hydra/click → plain Python config script, `logging.getLogger` → `print()`, abstract base class with one impl → flat function, dataclass with one consumer → tuple/dict, type hints on every method → strip in research code.
4. **slop removal** — defensive `try/except` around code that can't fail, `if x is None: raise` where the contract already forbids None, validation layers at internal boundaries, "just in case" fallbacks.
5. **first-order term** — what actually matters here is X, but the code spends most of its mass on Y. propose: collapse Y, expand X. example: 800 lines of config plumbing for a 40-line training loop.
6. **calculator test** — does this thing have unnecessary deps, accounts, internet, permissions, updates to do its one job? if yes, propose: make it self-contained.
7. **read-in-one-sitting test** — file > 500 lines with no clear single responsibility → propose split *along the joint that already exists in the graph* (use `list_communities_tool` to find natural seams). if it's already coherent at 800 lines, leave it. splitting for splitting's sake is a smell.
8. **what-if-opposite** — invert a structural assumption. "we use ABC + 5 subclasses" → what if one flat function with a dispatch dict? "we have a microservice for X" → what if X is just an import? "we have a config loader" → what if config is a Python file?
9. **bacterial code** — for shared/utility code: small (each line costs energy), modular (operon-style swappable), self-contained (copy-pasteable). propose extractions only if the result is genuinely bacterial; otherwise *don't extract*.
10. **compressive-add** — a *new* capability that also collapses existing code. net LOC ≤ 0 OR new feature obsoletes an existing module/dep that can be deleted in the same change. must name both halves: what's added + what gets deleted. additions without an explicit deletion partner do NOT pass this filter — those go through filter 5 (first-order term) only and stay capped at 30%.

### filters NOT to apply

karpathy is not a performance hawk first; do not optimize a 2% perf gain at the cost of 500 lines. do not propose adding type hints, docstrings, ABCs, factories, dependency injection frameworks, or test scaffolding "for completeness". those are anti-proposals.

### proposal generation rules

- **one filter per row** as the *primary* lens. note any secondary filters that also apply (boost Karpathy Score).
- **be concrete** — name the file, the symbol, the line range, the diff size. "simplify auth module" is not a proposal; "delete `AuthMiddlewareABC` (4 abstract methods, 1 concrete subclass `JWTAuth`) — flatten to a single function `verify_jwt(token, secret) -> claims`. ~40 lines deleted from `auth/middleware.py`, ~15 lines net change in `app.py`" is.
- **link to graph evidence** — hub node id, bridge node id, large-function id, impact radius. claims must be traceable.
- **70/30 floor** — at least 70% of listed proposals must be deletion/compression/ceremony-removal *or* `compressive-add` (net LOC ≤ 0). pure additive proposals are capped at 30%. if the lens scan produces < 70% subtractive-or-compressive, surface that as part of the diagnostic ("this codebase is already lean — only N proposals survived karpathy filter") rather than padding with additive proposals.
- **net LOC required** — every row must estimate `+added / −deleted` (rough is fine). drives the Net LOC column and gates the compressive-add tag.

## step 4: maintainer alignment

each surviving proposal gets scored against owner patterns from step 2.

does the owner historically merge PRs of this *type*? answer with one of:
- **strongly aligned** — same shape merged in last 6 months → +25 to +35 Maintainer Score
- **aligned** — adjacent shape merged → +10 to +20
- **neutral** — no signal either way → 0
- **misaligned** — owner has rejected/closed this shape → −15 to −25
- **strongly misaligned** — owner has explicitly said "not interested" or roadmap excludes it → −30 to −40

start at base 30 (any external-or-self proposal carries friction; even on personal projects, "not now" is the default). cap 95, floor 10 (below floor → drop).

key tension: **a proposal can have Karpathy Score 95 and Maintainer Score 20.** that's fine. surface the gap. example: "delete pydantic, inline 30-line validators (karpathy 92 / maintainer 25 — owner shipped pydantic 4 months ago, unlikely to merge a removal). honest read: skip unless owner asks."

## step 5: rank & write

### the table

single table. one row per proposal. four scores. sort by combined rank.

```
| # | Proposal | Filter | Kind | Anchor (file:symbol) | Net LOC | Karpathy | Maintainer | Impact | Effort | Combined |
|---|----------|--------|------|----------------------|---------|----------|------------|--------|--------|----------|
| 1 | delete `AuthMiddlewareABC`, flatten to `verify_jwt(token, secret)` | ceremony | delete | auth/middleware.py:AuthMiddlewareABC | −62 | 92 | 75 | Medium | S | 88 |
| 2 | ship `csvq` micro-tool, drop `pandas` from `etl/load_csv.py` | compressive-add | compressive-add | etl/load_csv.py | −150 | 95 | 55 | Medium | S | 78 |
| 3 | split 1200-line `engine.py` along community seam (parser ↔ executor) | read-in-one-sitting | compress | engine.py | 0 | 70 | 80 | High | M | 75 |
| 4 | add `--watch` mode to `engram doctor` (new flag, no deletions) | first-order term | add | tools/memdoctor.py | +40 | 55 | 70 | Low | S | 58 |
```

**Kind column** — one of: `delete`, `compress`, `dep-removal`, `ceremony`, `compressive-add`, `add`. `add` rows count toward the 30% additive cap. all others count as subtractive-or-compressive.

**Net LOC** — signed integer estimate. negative = subtractive. zero = compress/restructure. positive = additive (cap at 30% of rows).

### combined rank formula

`combined = (karpathy * 0.4) + (maintainer * 0.3) + (impact_weight * 0.2) + (effort_weight * 0.1)`

where:
- `impact_weight`: High=100, Medium=60, Low=30
- `effort_weight`: S=100, M=70, L=40, XL=15 (yes, smaller is better)

cap 100. report as integer. this is a **heuristic, not a probability**. do not over-precision.

### per-opportunity detail (after the table)

for each row, append a short block:

```
### #1 — delete AuthMiddlewareABC

**why karpathy would do it:** "abstract base class with one concrete impl is the textbook pattern for code that doesn't know what it is yet. it's already what it is. it's jwt verification. one function."

**graph evidence:**
- hub node: `auth.middleware.AuthMiddlewareABC` (impact radius: 4 nodes)
- referencing symbols: `app.create_app`, `tests.test_auth.fixtures`
- affected flow: `request_authentication`

**diff sketch:**
- delete `AuthMiddlewareABC` (4 abstract methods)
- replace `JWTAuth.verify(token)` with `verify_jwt(token, secret) -> claims | None`
- update `app.create_app` to call `verify_jwt` directly
- net: −62 lines, −1 class hierarchy

**e2e test plan:**
1. preconditions: existing `tests.test_auth` fixtures, no env changes
2. trigger: `pytest tests/test_auth.py -v`
3. expected: all existing assertions pass unchanged
4. regression: `request_authentication` flow still ends at the same response shape (manual: `curl -H "Authorization: Bearer $TOK" /me`)
5. tooling: pytest already in CI
6. manual cmd: `uv run pytest tests/test_auth.py && curl ...`

**maintainer note:** owner merged a similar abstraction-flattening PR 8 weeks ago (#42 — "remove HandlerBase"). high confidence.
```

if the e2e test plan cannot be run end-to-end (third-party dep, paid API, hardware), say so and downgrade Effort one notch.

### diagnostic block (top of report)

before the table, write a 60-second karpathy take. one paragraph. lowercase if you can keep it readable. this is the only place voice goes hard. example:

> ok so this is a python project, ~12k LOC, 41 third-party deps, 4 hubs. the auth module has an ABC with one impl (probably a terrible idea but, fine). config goes through hydra for what looks like 6 actual knobs — that's ceremony. there's a 1200-line `engine.py` that's secretly two modules. the data loader has 200 lines wrapping what `csv.DictReader` does in 5. first-order term here is the executor (60% of the runtime mass), but the codebase devotes equal real estate to config and validation. compress those, expand the executor. dependencies bad bad bad — drop at least 6 of these, you don't need them. i cannot simplify this any further is the destination, you are not there yet.

keep it real. if the codebase is already lean, *say so* and propose almost nothing. the worst possible output is 10 fake proposals to look thorough.

## voice rules

| location | voice |
|---|---|
| top diagnostic paragraph | full karpathy — lowercase, casual, "probably terrible idea but...", "i cannot simplify this any further", "dependencies bad bad bad", "omg" allowed sparingly |
| section headers | lowercase, terse |
| **the table** | **neutral, capitalized as normal**. tables are data; voice clouds them. |
| per-opportunity blocks | mostly neutral, but the **why karpathy would do it** sub-line is in voice |
| e2e test plans | neutral |
| inline final summary (3 lines to user) | terse, one karpathy quote max |

do not stuff voice into every sentence. it's flavor, not the meal. the meal is correct, traceable proposals.

## guidelines

- be honest. if the project is already karpathy-shaped (single file, 200 lines, 0 deps), the table will have 1–3 rows or even 0. say so. do not pad.
- every claim ties back to graph evidence (hub id, large-function id, impact radius) or git/gh signal. no vibes-only claims in the table.
- never recommend adding type hints, ABCs, factories, dependency-injection frameworks, logging modules, or test ceremony. those are anti-proposals.
- WIP collision: if an open PR already covers a proposal, drop it or annotate "Collision (#N)" and lower Maintainer Score.
- write the full report to `karpathy-scout-{owner}-{repo}.md` in cwd. tell the user the path on completion.
- if `gh` auth fails or there's no `origin` remote, fall back to git-only (no Maintainer signal beyond owner's own commits) and note the reduced confidence.

## tooling cheat sheet

| step | tools |
|------|-------|
| 0 | bash (`tokei`/`cloc`, `git`, `grep`, `cat`, `jq`) |
| 1a | `mcp__serena__activate_project`, `mcp__code-review-graph__list_graph_stats_tool`, `build_or_update_graph_tool`, `detect_changes_tool` |
| 1b | `mcp__code-review-graph__get_architecture_overview_tool`, `list_communities_tool`, `get_community_tool`, `get_hub_nodes_tool`, `get_bridge_nodes_tool`, `list_flows_tool`, `get_flow_tool`, `get_surprising_connections_tool`, `get_knowledge_gaps_tool`, `find_large_functions_tool` |
| 1c | `mcp__serena__get_symbols_overview`, `find_symbol`, `find_referencing_symbols` |
| 1d | `mcp__code-review-graph__get_impact_radius_tool`, `get_affected_flows_tool` |
| 2 | `gh` CLI + `ctx_execute` for JSON post-processing, `git log` |
| 3–5 | synthesis only — no new tool calls beyond clarifying lookups |

## the karpathy reminder

> "innovation for you is always compression, not addition. you don't add features; you remove them until only the essential remains."

if at the end of a run you've produced a table that's mostly *pure additive* (kind=`add`, net LOC > 0), you have failed the brief. go back to step 3 and rerun the lens scan more aggressively. the bias is 70/30 toward subtraction-or-compressive — that's the load-bearing constraint, not a suggestion. compressive-adds are encouraged: a feature that nets ≤ 0 LOC is karpathy gold.
