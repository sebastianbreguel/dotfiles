# MCP Routing: Serena + code-review-graph

Complementary, not interchangeable. Route by intent.

## Auto-activation (first repo interaction)

Before any exploration/edit in a new-session repo:
1. `mcp__serena__activate_project` with `project="."` (silent, read-only).
2. `mcp__code-review-graph__list_graph_stats_tool` → if missing/stale, ask user before `build_or_update_graph_tool`.

## Routing

| Intent | Tool |
|---|---|
| Architecture / impact / flows | **graph**: `semantic_search_nodes`, `get_impact_radius`, `get_affected_flows`, `get_architecture_overview`, `list_communities` |
| Locate/read/edit symbol | **serena**: `find_symbol`, `get_symbols_overview`, `replace_symbol_body`, `insert_before/after_symbol`, `rename_symbol` |
| Find references | **serena** `find_referencing_symbols` — never Grep |
| Refresh graph post-edit | **graph** `detect_changes` |

## Prohibitions

- Never Grep for symbol refs → `find_referencing_symbols`.
- Never Read >200-line file for one symbol → `find_symbol(include_body=True)`.
- Never serena for macro questions (modules, hubs, flows) → graph.
- Never graph to edit → plan with graph, execute with serena.
- Never Read whole-file if `get_symbols_overview` answers.

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

Typos, 1-line fixes, PR body, `gh`, doc tweaks → skip both, Edit/Bash direct.

## Gitignore

First serena use in a repo → add `.serena/` to `.gitignore`.
