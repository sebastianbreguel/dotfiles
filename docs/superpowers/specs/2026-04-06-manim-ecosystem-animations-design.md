# Claude Code Ecosystem Animations — Design Spec

**Date:** 2026-04-06
**Purpose:** Onboarding — explain how each layer of the Claude Code ecosystem works day-to-day
**Format:** 5 independent GIFs (Manim Community Edition), ~20-25s each
**Approach:** Modular scenes, one per ecosystem layer

---

## Project Structure

```
animations/
├── scenes/
│   ├── overview.py          # Scene 1: big picture
│   ├── hooks.py             # Scene 2: hooks flow
│   ├── plugins_mcp.py       # Scene 3: plugins + MCP
│   ├── skills.py            # Scene 4: skills workflow
│   └── agents.py            # Scene 5: agents
├── common/
│   ├── styles.py            # Colors, fonts, shared sizes
│   └── components.py        # Reusable blocks (boxes, arrows, labels)
├── output/                  # Generated GIFs
├── Makefile                 # `make all`, `make overview`, etc.
└── requirements.txt         # manim, pillow
```

## Visual Style

- Background: dark (#1a1a2e)
- Hooks: cyan (#00d2ff)
- Plugins/MCP: purple (#a855f7) / magenta (#ec4899)
- Skills: green (#22c55e)
- Agents: orange (#f97316)
- Core (Claude Code): white/light gray
- Font: monospace for code, sans-serif for labels
- Minimalist, no noise

---

## Scene 1: Overview (~20s)

1. Central rectangle appears: **"Claude Code"**
2. 4 concentric layers expand outward, one by one:
   - **Hooks** (innermost, cyan) — "intercept every command"
   - **Plugins / MCP Servers** (purple) — "always-on services extending capabilities"
   - **Skills** (green) — "on-demand invocable workflows"
   - **Agents** (orange) — "specialized subagents for complex tasks"
3. Bidirectional arrows connect each layer to the core
4. Final label: *"Each layer amplifies what Claude Code can do"*

## Scene 2: Hooks (~25s)

1. User types: `git status`
2. Arrow down to **"Hook: PreToolUse"** box (cyan, pulsing)
3. Box intercepts and transforms: `git status` → `rtk git status`
4. Arrow to **RTK** which returns compressed output
5. Label: *"60-90% fewer tokens consumed"*
6. Second mini-sequence: user writes code → **"Hook: PostToolUse"** intercepts output → **context-mode** indexes automatically
7. Final label: *"Hooks = invisible middleware optimizing every interaction"*

Concrete examples shown:
- `PreToolUse:Bash` → rewrites to RTK
- `PostToolUse:Read` → context-mode indexes
- `UserPromptSubmit` → pre-send validations

## Scene 3: Plugins + MCP Servers (~25s)

1. **Claude Code** center
2. Left side: **Plugins** (purple boxes) appear one by one:
   - **context-mode** — "indexes outputs, saves context window"
   - **claude-mem** — "persistent cross-session memory"
   - **playwright** — "headless browser automation"
   - **context7** — "up-to-date docs for any library"
3. Right side: **MCP Servers** (magenta boxes) appear:
   - **ClickUp** — "task management"
   - **PostHog** — "analytics and feature flags"
   - **Excalidraw** — "collaborative diagrams"
4. Bidirectional arrows to core
5. Mini animated example: Claude needs React docs → arrow to context7 → response returns → Claude responds with updated info
6. Final label: *"Plugins = local capabilities. MCP = external integrations. Both always available."*

## Scene 4: Skills (~25s)

1. User types: `/commit`
2. Arrow to **"Skill: ship-pr"** box (green)
3. Box expands showing internal workflow steps, appearing sequentially:
   - `git status` → `git diff` → `git log` → draft message → commit → push → PR
4. Each step gets checked (checkmark) on completion, pipeline-style
5. Collapses. Brief pause.
6. 3 skill categories appear as columns:
   - **Process:** brainstorming → writing-plans → executing-plans (sequential arrows)
   - **QA:** test-and-fix, pre-merge-review, explore-app
   - **Ops:** dream (memory), doc-sync, weekly-retro
7. Final label: *"Skills = complete workflows activated with a slash command"*

## Scene 5: Agents (~25s)

1. Claude Code receives complex task: *"Review this PR and plan the refactor"*
2. Claude Code forks into 2 parallel subagents:
   - **code-reviewer** (orange) — analyzes the diff
   - **fullstack-refactor-architect** (orange) — designs the plan
3. Each works independently (parallel spinners)
4. Both return results → arrows converge back to Claude Code
5. Claude Code synthesizes and responds to user
6. Brief pause. Grid of available agents appears, grouped:
   - **Code:** code-reviewer, code-simplifier, code-modularizer
   - **Architecture:** tech-lead, fullstack-refactor-architect, db-engineering
   - **AI/ML:** ai-ml-expert, prompt-engineering, ai-researcher
   - **Personas:** andrej-karpathy, ilya-sutskever, yann-lecun, leonardo-da-vinci
7. Final label: *"Agents = on-demand specialists that work in parallel"*

---

## Summary

| Scene | Topic | Duration | Key Message |
|-------|-------|----------|-------------|
| 1 | Overview | ~20s | 4 layers amplifying Claude Code |
| 2 | Hooks | ~25s | Invisible middleware optimizing everything |
| 3 | Plugins + MCP | ~25s | Local capabilities + external integrations |
| 4 | Skills | ~25s | Complete workflows via slash command |
| 5 | Agents | ~25s | Parallel on-demand specialists |

**Total: ~2 min across 5 independent GIFs**

## Dependencies

- Python 3.10+
- Manim Community Edition
- ffmpeg (for GIF export)
- Pillow (for GIF optimization)
