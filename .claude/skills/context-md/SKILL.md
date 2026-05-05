---
name: context-md
description: Build or update a project's CONTEXT.md — the ubiquitous-language glossary that lets the agent and user share one vocabulary. Use when user wants to define domain language, build a glossary, set up ubiquitous language, audit terminology drift, or fix verbose/confused agent output traceable to vocabulary mismatch. Triggers: "build a CONTEXT.md", "ubiquitous language", "shared language", "domain glossary", "audit terms".
---

<what-to-do>

Build or refresh `CONTEXT.md` at the repo root (or per-context for multi-context repos). Glossary only — no plan, no ADRs, no architecture proposals. Walk term-by-term until the user has a tight, opinionated, conflict-resolved vocabulary written to disk.

Ask one question at a time. Wait for feedback before continuing. If a question can be answered by exploring the codebase, explore instead of asking.

</what-to-do>

<supporting-info>

## Scope guardrail

This skill is **narrow**: glossary terms, relationships, ambiguities. If the user starts pitching a feature, redesigning architecture, or making hard-to-reverse decisions → stop and hand off:

- Plan/feature grilling → `grill-with-docs`
- Architecture refactor → `improve-codebase-architecture`
- Bug investigation → `diagnose`

Stay in the language lane.

## Phase 1 — Detect state

Check repo:

- `CONTEXT.md` at root → **update mode**: audit existing terms, find drift, propose additions
- `CONTEXT-MAP.md` at root → **multi-context mode**: ask which context the user wants to work on; descend to that subdir's `CONTEXT.md`
- Neither → **build mode**: create from scratch, lazy-write file when first term resolves

## Phase 2 — Seed terms

Don't ask the user to brainstorm cold. Mine candidates first:

- Recent commits, PR titles, issue titles
- Top-level directory names under `src/`
- Most-imported module names
- README headings
- User's recent message (terms they just used)

Produce a candidate list (5-15 terms). For each, infer a 1-sentence definition from how it's used in code. Show the list to the user. They prune, rename, add.

## Phase 3 — Grilling loop

For each candidate term, ask one question at a time:

### Disambiguation
> "Code uses `account` and `customer` interchangeably. Are they the same thing? If different — which is the canonical term and which is the alias?"

### Boundary
> "Where does an Order end and an Invoice begin? When a Customer pays at checkout, is that Order.paid or Invoice.paid?"

### Cardinality
> "Does one Customer have many Orders, or can an Order have multiple Customers (e.g. shared)?"

### Aliases to forbid
> "I see 'transaction', 'purchase', and 'order' used for the same concept. Pick one canonical. Others go in `_Avoid_`."

### Code/concept conflict
> "Your code calls it `BillingAccount` but you just said 'Customer'. Rename the code, or rename the term?"

### Sharpening fuzz
> "You said 'process the order'. Process = validate, fulfill, charge, ship? Pick the canonical verb."

After each answer → update `CONTEXT.md` inline. Don't batch.

## Phase 4 — Format

Use exactly this structure:

```md
# {Project / Context Name}

{1-2 sentences: what this context is and why it exists.}

## Language

**Term**:
One-sentence definition — what it IS, not what it does.
_Avoid_: alias1, alias2

**OtherTerm**:
One-sentence definition.
_Avoid_: alias1

## Relationships

- A **Term** has many **OtherTerm**
- An **OtherTerm** belongs to exactly one **Term**

## Flagged ambiguities

- "x" was used for both A and B — resolved: x = A; B is now called Y.
```

## Rules (hard)

- **One sentence per term**. Define what it IS, not what it does.
- **Opinionated**. Pick canonical, list aliases under `_Avoid_`. No equal-weight synonyms.
- **Domain only**. No general programming concepts (timeout, retry, cache, request, response). If it would appear in any project's glossary, it doesn't belong.
- **Bold term names** in relationships and definitions.
- **Cardinality explicit** when obvious.
- **Flagged ambiguities** must always carry a resolution. No open questions in the file.
- **Lazy file creation**. Don't write `CONTEXT.md` until the first term is resolved.

## Multi-context detection

If `CONTEXT-MAP.md` exists at root → multi-context. Ask user which one to work on. Descend to that directory.

If repo has clear bounded contexts (e.g. monorepo with `apps/billing`, `apps/ordering`) but no map → ask once: "Looks like multiple contexts. Want me to set up `CONTEXT-MAP.md` + per-app `CONTEXT.md`, or single-root?"

Default = single root.

## Done condition

Stop when:

- Every candidate term is resolved (canonical + aliases + 1-sentence def) OR explicitly deferred
- No ambiguity flagged without a resolution
- File written to disk
- User confirms the glossary reflects how they think

Don't pad. A 5-term `CONTEXT.md` that's tight beats a 30-term one full of fuzz.

</supporting-info>
