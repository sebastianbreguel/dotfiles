---
name: tech-research
description: 'Construí kit de prácticas audit-grade para cualquier tech/framework/repo: doc, research primary-source, checklist, audit skill compañera. Anclado a fuentes 2025-2026. Triggers: "build practices docs for X", "research X 2026", "bootstrap audit kit", "practices reference for X".'
---

# Tech Research

Build a complete, audit-grade practices reference for any technology, framework, or
specific repo. Produces four artifacts in one folder:

1. `best-practices.md` — imperative single-source-of-truth rules.
2. `research/0N_<dimension>.md` — audit trail with primary sources.
3. `checklist.md` — blocker / major / minor list with detection hints.
4. `audit-skill/SKILL.md` — companion audit skill that consumes (1)–(3).

The output is the input to a future audit. This skill produces the **knowledge
layer**; the companion audit skill produces the **report layer**. Quality of the
audit is bounded by the quality of this research, so the source gate is strict.

This skill is tech-agnostic. It does not assume Python, Node, or any specific
stack. The topic determines the dimensions, the dimensions determine the
research, and the research determines the rules.

## When to invoke

Trigger on:
- "research X best practices", "build a practices reference for X"
- "generate audit-grade docs for X", "make the kind of docs this repo has but for X"
- "produce imperative rules for X (2026)"
- "scaffold practices kit for X"
- "I want to audit X but have no checklist yet"
- A repo path or GitHub URL plus a request to "research the stack" or "build a reference"

Do NOT trigger on:
- Quick library lookup questions (use `context7` or web search directly).
- Single-file refactors / debugging (use `tech-lead`, `hunt`, `diagnose`).
- Auditing a repo against an *existing* reference — that is the companion audit
  skill produced here, or `py-audit` for Python repos.

## Inputs

- **Topic** (required): the technology + scope. Examples:
  - `"Next.js 15 production-grade"`
  - `"Rust axum services 2026"`
  - `"Kubernetes operators with kubebuilder"`
  - `"Go fiber + sqlc + pgx"`
  - `"Postgres 17 OLTP tuning"`
  - `"Terraform module hygiene 2026"`
  - `"SwiftUI + async/await iOS apps"`
- **Target** (optional): a local repo path or GitHub URL. If provided, detect
  the stack and use it to *constrain and refine* the topic — do not let the
  detected stack silently override the user's requested scope.
- **Out path** (optional, default `docs/repo/<slug>/` inside cwd, or inside the
  target if a target was given): where to write the produced reference.
- **Slug**: derive from topic — lowercase, hyphenated, ASCII. e.g.
  `"Next.js 15 production"` → `nextjs-15-prod`. Confirm slug with user once if
  the topic is ambiguous.

If the user supplies neither a topic nor a target, ask for the topic before
proceeding. Do not guess.

## Source quality bar

Hold the bar — it is the entire reason for this skill exists.

See `references/source-gate.md` for the full primary / non-primary criteria,
date thresholds, exceptions for stable specs, and the agent push-back loop. Read
that file before dispatching agents in Phase 2.

Imperative voice. "Use `<X>`", not "Consider `<X>`". Reasoning lives in the
research files; the consolidated doc states the rule. Every imperative rule in
`best-practices.md` must trace to at least one primary source in the matching
`research/0N_*.md`. If you cannot find one, drop the rule or downgrade it to a
"convention" note clearly marked as opinion.

## Protocol — 6 phases

### Phase 1 — Scope and dimensions

1. Resolve topic + optional target into a **scope card**. Pick a dimension
   preset that matches the topic shape (web service, CLI tool, infra/IaC,
   library/SDK, data layer, frontend app, mobile app). See
   `references/dimension-presets.md` for the canonical preset list and the
   typical 5–6 dimensions per preset. Adapt — fewer well-researched dimensions
   beat more thin ones. Do not pad.

2. If a target was provided, detect the stack:
   - Read top-level manifests / lockfiles / configs (any of:
     `package.json`, `pnpm-lock.yaml`, `pyproject.toml`, `go.mod`, `Cargo.toml`,
     `Gemfile`, `composer.json`, `pubspec.yaml`, `mix.exs`, `Package.swift`,
     `build.gradle*`, `pom.xml`, `*.csproj`, `Dockerfile*`, `docker-compose*`,
     `.tool-versions`, `.nvmrc`, `Makefile`, `CMakeLists.txt`, `.github/workflows/*`,
     `README` header).
   - Note actual versions and pinned major libraries. Research what the user is
     *actually using*, not the ecosystem average.
   - If the user's topic disagrees with the detected stack (e.g., topic says
     "Next.js" but repo is Remix), surface the conflict to the user before
     researching. Do not silently pivot.

3. Write the scope card to chat (one paragraph: topic, preset, dimensions,
   detected versions if any). Wait for confirmation only if the topic was vague;
   otherwise proceed.

### Phase 2 — Parallel research dispatch

Dispatch one research agent per dimension in a single message via multiple
Agent calls. Use these agent types where available; fall back to
`general-purpose` if not:

| Dimension shape                        | Preferred agent                                     |
|----------------------------------------|-----------------------------------------------------|
| Framework / runtime / SDK              | `compound-engineering:ce-framework-docs-researcher` |
| Language tooling, conventions, patterns| `compound-engineering:ce-best-practices-researcher` |
| Security, supply chain, OWASP          | `security-auditor` + web research                   |
| Observability, deploy, CI/CD           | `compound-engineering:ce-web-researcher`            |
| Data / DB / pipelines                  | `pipeline-engineer` or `database-engineer`          |
| LLM / AI                               | `llm-engineer`                                      |
| General / unmatched                    | `general-purpose`                                   |

Each agent gets the same brief, with `<dimension>` and `<topic>` substituted:

> Research `<dimension>` for `<topic>` to produce an imperative practices
> reference dated 2025-2026. Return:
> 1. 8–15 imperative rules ("Use X", "Do not use Y"), each with a one-line
>    rationale and a primary-source URL with publish/update date.
> 2. A "dead on sight" list — patterns / libs / configs that should not appear
>    in new code, with the reason and the year the consensus shifted.
> 3. 3–5 "wins" — non-obvious things teams routinely miss that materially
>    improve outcomes.
> Reject sources older than 2025-01-01 unless they are stable specs (RFC, PEP,
> OWASP, W3C). Reject AI summaries, tutorial farms, undated posts.
> Imperative voice. Do not write code beyond minimal config snippets needed to
> make a rule actionable. Keep the response under 700 words.

Before dispatching, use `mcp__plugin_context7_context7__query-docs` for any
named library or framework in the brief to ground the agent in current docs.
This single step removes most stale-training-data errors. If `context7` does
not have the library, fall back to direct web search of the official docs URL.

If an agent returns sources that fail the gate, push back once with the
specific complaint (e.g., "source X is undated; replace or drop the rule");
accept the second response. Track which rules survived the second pass.

### Phase 3 — Synthesize the reference

Write three artifacts under `<out>/<slug>/`:

#### `research/0N_<dimension-slug>.md` (one per dimension)

Audit trail. Every rule in `best-practices.md` cites one of these. Use this
structure:

```markdown
# <Dimension> — <Topic>

_Last reviewed: <YYYY-MM-DD>_

## Decisions

### Use `<X>` for <purpose>
Source: <URL> (<publish or update date>)
Rationale: <1-3 lines>

### Do not use `<Y>` in new code
Source: <URL> (<date>)
Rationale: <1-3 lines>
Migration: <if applicable, 1 line>

## Dead on sight
- `<lib/pattern>` — <one-line reason>, <year consensus shifted>

## Wins (non-obvious)
- <rule + 1-line why>

## Open questions
- <anything contested>
```

#### `best-practices.md` (single source of truth)

Compressed, imperative, ~500–800 lines. Aim low; the value is in compression.

```markdown
# <Topic> — Best Practices (2026)

Imperative reference. Every rule cites `research/0N_*.md`. Disagree?
Read the research file first.

## 1. <Dimension 1>
- Use `<X>` for <purpose>. → research/01_<...>.md
- Do not use `<Y>`. → research/01_<...>.md

## 2. <Dimension 2>
...

## N. Audit checklist
See `checklist.md`.
```

Cross-reference each rule by research filename, not URL — research files own
the URLs. Keeps drift detection easy.

#### `checklist.md` (audit input)

The blocker / major / minor list a future audit will mechanically check.

```markdown
# <Topic> — Audit Checklist

## Blockers (must fix before prod)
- [ ] <rule> — detection: <grep / file / config check> — fix: <one line>

## Major
- [ ] <rule> — detection: ... — fix: ...

## Minor / hygiene
- [ ] <rule> — detection: ... — fix: ...
```

Detection hints are load-bearing. A rule with no machine-checkable signal
becomes opinion. If a rule cannot be detected mechanically, mark it
`(manual review)` and keep it — but try to find a proxy signal first
(file presence, version pin, env var, header, status code, log line).

### Phase 4 — Companion audit skill

Generate `<out>/<slug>/audit-skill/SKILL.md`. By default the audit skill lives
**inside the produced docs folder**, alongside the reference it consumes. The
user can later copy or symlink it into `~/.claude/skills/<slug>-audit/` to
make it globally invokable.

Use `references/audit-skill-template.md` as the starting point and substitute:
- `<TOPIC>`, `<SLUG>`, `<DIMENSIONS>`, `<DOCS_PATH>`.
- Mechanical checks pulled from `checklist.md` detection hints.
- Stack-marker file globs from the dimension preset.

The companion skill must:
- Mirror the canonical audit phases: orient → parallel domain dispatch →
  mechanical checks → consolidate → score → report.
- Cap scope to dimensions present in the produced docs. Do not invent new
  dimensions.
- Be read-only on the target; write only `AUDIT_REPORT.md` at target root.
- Keep the budget and privacy rules from the template — they are load-bearing.

### Phase 5 — Verify

Before declaring done:

1. Every rule in `best-practices.md` has a research-file pointer.
2. Every research file has at least one cited URL with a 2025+ date (or a
   stable-spec exception, called out as such).
3. `checklist.md` covers every rule from `best-practices.md` that has a
   machine-checkable signal.
4. The companion audit skill's frontmatter parses (open it once and check the
   YAML), and its trigger phrases include the slug.

If any check fails, fix in place — do not report the artifact as ready.

### Phase 6 — Report

Print to chat, in this order, nothing else:

1. Slug + total word count of `best-practices.md`.
2. Number of rules per dimension (small table).
3. Source counts per dimension (primary / spec / total).
4. Absolute paths to the four artifacts.
5. The exact phrase to invoke the companion audit skill, and a one-line note
   on how to promote it to global (`cp -r <path> ~/.claude/skills/<slug>-audit/`).

Do not dump any of the produced docs into chat. The user will read the files.

## Rules

- **Read-only on the target repo.** Write only inside the chosen output
  directory. Never edit user code.
- **Idempotent.** Running twice with the same topic + target overwrites the
  produced docs. Keep `_Last reviewed:_` dates so drift is visible.
- **Cite or drop.** A rule with no primary source either gets one or gets cut.
  Compression is the value.
- **Match the topic, not the ecosystem average.** If the user is on Vue, do
  not research React. If on Postgres 16, do not write rules that only apply
  to 17. The detected stack constrains the research.
- **Budget.** 8–12 minutes wall-clock for a typical 6-dim topic. If it stretches
  past 15, drop dimensions and note the cut in the report header
  (`_(scope reduced)_`).
- **Privacy.** Never copy private repo contents into the produced docs. Code
  examples must come from public sources or be synthesized minimal snippets.

## Style notes

- Imperative voice everywhere in the consolidated doc.
- Every research file leads with `_Last reviewed: <date>_` so the next audit
  knows whether to refresh.
- Prefer compression to completeness — a 500-line doc with 60 cited rules
  beats a 2000-line doc with 200 half-cited rules.
- Decision rule for placement: "would an auditor mechanically check this?"
  → yes: `best-practices.md` + `checklist.md`. → no: `research/`.
