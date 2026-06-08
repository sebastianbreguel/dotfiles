---
name: feature-scout
description: Maps a codebase and product context, then ranks feature ideas by Value × Difficulty × Time (Karpathy + Product lens). Invoked explicitly for a ranked feature audit of a repo.
---

# Feature Scout

Turn a codebase into a ranked list of features worth building. You first understand
the product (so "value" means something real), then map the code (so "leverage" is
grounded in what already exists), then generate and score candidates.

The whole point is **leverage × value**: the best features unlock a lot of user value
with a small, well-placed change that composes things the code already has. Two mental
models drive the work:

- **Karpathy lens (engineering leverage / simplicity):** What's the smallest change for
  the biggest capability unlock? Does it compose primitives that already exist, or need
  new infra? Does it attack the *real* bottleneck rather than a cosmetic one? Can it be
  measured/eval'd? This lens drives both **what candidates you generate** and the
  **Difficulty score**.
- **Product lens (user value):** Who hurts, how badly, how many of them? Does it move the
  one metric that matters? Will users actually adopt it? This lens drives the **Value score**.

The lenses are *not* extra numbers — they're the reasoning behind the three metrics you output.

## Workflow

Run these four phases in order. Don't skip Phase 1: without product context, "value"
is a guess and the ranking is noise.

### Phase 1 — Product interview (do this first, before touching code)

Ask the user a few short questions and wait for answers. Keep it to 3–4 questions;
this is the rubric for every Value score later, so it has to be real.

Ask about:
1. **Who are the users?** (e.g. internal ops team, external SMB customers, other developers)
2. **What is the product trying to do?** The core job it exists for.
3. **The one metric that matters most right now.** (activation, retention, revenue,
   latency, support load — whatever they're actually steering by)
4. **Hard constraints.** (e.g. "no new infra", tiny team, must ship this quarter, regulated data)

If the user already gave some of this in the conversation, don't re-ask — confirm what
you inferred in one line and ask only for the gaps.

### Phase 2 — Map the codebase (hybrid: graph first, scan as fallback)

You need a structural picture before ideating: the modules, the main flows, and the
spots that are thin, tangled, half-built, or unused. Those weak spots are where the best
gap-closing features hide.

**Preferred path — `code-review-graph` MCP** (if installed and a graph exists):
1. Call `mcp__code-review-graph__list_graph_stats_tool` to check the graph exists and is fresh.
   - Treat the graph as **stale** if its file count clearly diverges from the working
     tree (run a quick `Glob` to compare) or it was last updated more than ~14 days ago.
   - If missing or stale, **ask the user** before building: building/updating a graph
     can take a while on a big repo. If they approve, call
     `mcp__code-review-graph__build_or_update_graph_tool`.
   - If the graph is missing/stale **and** the user declines to rebuild, don't use the
     stale graph — route to the lightweight scan fallback below.
2. Then pull the macro picture (these are the high-signal calls, in rough priority order):
   - `get_architecture_overview_tool` — modules and how they relate
   - `list_communities_tool` — clusters of related code
   - `get_hub_nodes_tool` / `get_bridge_nodes_tool` — the load-bearing code (high leverage to touch)
   - `list_flows_tool` — end-to-end flows (look for ones that dead-end or are half-built)
   - `get_knowledge_gaps_tool` — under-documented / under-tested areas
   - `find_large_functions_tool` — complexity hotspots (often a refactor *is* the feature enabler)

**Fallback path — lightweight scan** (MCP unavailable, no graph, or the user declines a build):
Use Glob / Grep / Read directly, but stay shallow — you want the shape, not every line:
- Entry points, route/handler definitions, top-level commands
- Data models / schema files
- `TODO` / `FIXME` / `HACK` markers (often literal feature breadcrumbs)
- Exported symbols that are never imported elsewhere (dead or under-leveraged capabilities)
- README / docs to cross-check product intent against what the code actually does

Hold the full map internally (key modules, main flows, under-leveraged spots) — it
feeds Phase 3. You'll surface a **distilled** version of it in the report's "Map summary"
and "Gap & opportunity" sections, with concrete file/line citations; you just don't paste
the raw exploration dump.

**If the interview contradicts the code** (e.g. the user calls it an "MCP server" but the
repo is a CLI), don't silently pick one. Note the discrepancy in the report's Context
section, then trust the **code** for Difficulty/leverage and the **interview** for Value —
the user knows the intended value even if the description of the mechanism is off.

### Phase 3 — Generate candidates (two buckets)

Generate features into two buckets. Aim for a healthy pool (roughly 10–20 raw ideas)
before you trim; you'll rank and cap later. An approximate raw count is fine — don't
agonize over an exact tally.

**Bucket A — Gaps & opportunities** (grounded in the map):
- Half-built flows that stop short of paying off
- Capabilities that exist in the code but aren't exposed/used (under-leveraged primitives)
- Dead code that signals an abandoned-but-valuable direction
- Knowledge/test gaps around something important
- Things that are *one step away* from an existing primitive (highest leverage — cheap to build)

**Bucket B — Net-new features** (map + product context):
- Ideas the product's goal + user pain suggest, that the code is positioned to support

Apply the **Karpathy lens** while generating: prefer ideas that attack the real
bottleneck, cut complexity rather than add it, compose what exists, and let you *learn*
something (build-to-learn / de-risk an unknown). Be willing to propose deletions or
simplifications as "features" when they unlock disproportionate value.

### Phase 4 — Score, rank, and write the report

Score every surviving candidate on three metrics. Keep the rationale to one line per lens.

- **Value (1–5)** — Product lens. 5 = hits the metric that matters for a large slice of
  users in real pain; 1 = nice-to-have for few users.
- **Difficulty (1–5)** — Karpathy lens. **1 = composes existing primitives, smallest
  possible change, attacks the real bottleneck. 5 = needs new infra, touches load-bearing
  hubs broadly, lots of unknowns.** (Lower is better.)
- **Time** — rough estimate. Use S / M / L (≈ <1 day / a few days / 1–2+ weeks) or rough
  hours/days. This is a sanity check on Difficulty, not a precise estimate.

**Ranking rule:** sort by best value-to-cost first — **high Value, low Difficulty, low
Time** at the top. A simple tiebreak: rank by `Value − Difficulty`, then by Time. Don't
over-formalize; the order should read as "what a sharp engineer would build first."

List **all** candidates that survive, **capped at 10**. If you generated more, keep the
top 10 by the ranking rule and say how many you dropped.

Write the report to a local file named `feature-scout-report.md` in the current working
directory. **Do not commit it** — it's a scratch artifact for the user to act on. Use
the exact structure below.

## Report structure

ALWAYS use this template:

```markdown
# Feature Scout Report — <project name>

## Context (from interview)
- **Users:** ...
- **Product goal:** ...
- **Key metric:** ...
- **Constraints:** ...

## Map summary
2–4 sentences: the main modules, the key flows, and where the code is thin / tangled /
half-built. Name real files or modules so the reader can verify.

## Gap & opportunity report
Bullet list of what's missing or under-leveraged, each grounded in something concrete
from the map (a file, a flow, a dead export). This is the "what's wrong / unfinished" view.

## Ranked features
Sorted best-first. One block per feature:

### 1. <feature name>  ·  Value N/5 · Difficulty N/5 · Time S/M/L
- **What:** one or two sentences.
- **Karpathy (leverage):** why it's cheap/high-leverage — what existing code it builds on.
- **Product (value):** who it helps and which metric it moves.
- **Builds on:** specific files/modules/flows it touches.

(repeat for each, max 10)

## Quadrant view (Value vs Difficulty)
A quick 2×2 so the eye can find the obvious wins. Place each feature by number.

|                 | Low Difficulty (1–2)        | High Difficulty (3–5)     |
|-----------------|------------------------------|----------------------------|
| **High Value (4–5)** | **Build now:** #x, #y    | **Big bets:** #z          |
| **Low Value (1–3)**  | **Quick wins / later:** #a | **Skip:** #b              |
```

## Notes on tone and judgment

- Be opinionated. A ranked list where everything is "Value 4, Difficulty 3" is useless —
  spread the scores and defend the spread in the one-liners.
- Ground every claim in the map. "Builds on `auth/session.py`" beats "leverages existing auth."
- Prefer fewer, sharper features over a long mushy list. The cap is 10; you rarely need it.
- If the codebase is tiny or the product context is unclear, say so and scope down rather
  than inventing features to fill a quota.
