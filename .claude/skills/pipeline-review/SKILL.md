---
name: pipeline-review
description: Full-stack pipeline code audit using parallel specialized agents. Use this skill whenever the user asks to "review the pipeline", "audit this code", "full code review", "simplify the pipeline", "review all steps", "code audit", "review the flow", or wants a comprehensive multi-perspective review of a multi-step codebase (ETL pipelines, data pipelines, API flows, processing chains). Also trigger when the user mentions wanting to make pipeline code simpler, cleaner, or more maintainable. This skill orchestrates software reviewers, database engineers, and a tech lead to produce actionable changes — not just observations.
---

# Pipeline Review

You are orchestrating a comprehensive code audit of a multi-step pipeline. The goal is not just to observe problems — it's to produce concrete, actionable changes that make the code simpler, cleaner, and more maintainable.

## Before You Start

1. **Identify the pipeline scope.** Ask the user which files or directories comprise the pipeline if it's not obvious. Look for patterns like numbered steps, sequential processing stages, or a main orchestrator file that calls sub-modules.

2. **Create the output directory:**
   ```
   reviews/<date>-pipeline-review/
   ```

3. **Build a pipeline map.** Before dispatching agents, understand the flow:
   - What are the pipeline steps/stages?
   - What data flows between them?
   - Which files implement each step?
   - Where are the database interactions?

   Write this map to `reviews/<date>-pipeline-review/pipeline-map.md`. This file becomes the shared context for all agents.

## Phase 1: Parallel Agent Reviews

Dispatch these three agents **simultaneously** in a single message. Each agent gets the pipeline map plus its specific focus area.

### Agent 1: Software Review (code-reviewer)

Use the `superpowers:code-reviewer` agent with this prompt:

```
You are reviewing a multi-step pipeline for code quality, simplicity, and maintainability.

Pipeline map: <include pipeline-map.md content>
Files to review: <list all pipeline files>

Focus on:
- Dead code, unused imports, redundant logic
- Overly complex abstractions that could be simplified
- Error handling that's excessive or missing where it matters
- Copy-pasted logic across pipeline steps that should be extracted
- Functions doing too many things (single responsibility violations)
- Naming clarity — can you understand what each step does from names alone?

For EVERY issue you find, provide:
1. File and line number
2. What's wrong (one sentence)
3. The concrete fix (actual code or clear pseudocode)
4. Impact: high/medium/low

Save your review to: reviews/<date>-pipeline-review/software-review.md
```

### Agent 2: Database Engineering Review (db-engineering)

Use the `db-engineering` agent with this prompt:

```
You are reviewing a multi-step pipeline focusing on all database interactions.

Pipeline map: <include pipeline-map.md content>
Files to review: <list all pipeline files>

Focus on:
- Query efficiency (N+1 queries, missing indexes, full table scans)
- Connection management (leaks, pool exhaustion, missing cleanup)
- Transaction boundaries (too broad, too narrow, missing where needed)
- SQL injection risks or unsafe query construction
- Schema assumptions that could break (missing NULL checks, type mismatches)
- Opportunities to batch operations instead of row-by-row processing

For EVERY issue you find, provide:
1. File and line number
2. The current query or DB interaction
3. What's wrong and why it matters at scale
4. The optimized replacement (actual SQL or code)
5. Impact: high/medium/low

Save your review to: reviews/<date>-pipeline-review/db-review.md
```

### Agent 3: Clean Code Review (clean-code-reviewer)

Use the `clean-code-reviewer` agent with this prompt:

```
You are reviewing a multi-step pipeline for clean code principles and replicability.

Pipeline map: <include pipeline-map.md content>
Files to review: <list all pipeline files>

Focus on:
- Code that's hard to follow without comments (but don't just add comments — simplify instead)
- Magic numbers, hardcoded values that should be configuration
- Inconsistent patterns across pipeline steps
- Missing or misleading type hints
- Functions with too many parameters
- Testing gaps — which parts would be hardest to test and why?

For EVERY issue you find, provide:
1. File and line number
2. What's wrong (one sentence)
3. The concrete simplification (actual code)
4. Impact: high/medium/low

Save your review to: reviews/<date>-pipeline-review/clean-code-review.md
```

## Phase 2: Tech Lead Synthesis

Once all three Phase 1 agents complete, dispatch the `tech-lead` agent with ALL three review files:

```
You are the tech lead doing the final review of a pipeline audit. Three specialists have already reviewed the code. Your job is to:

1. READ all three reviews carefully
2. DEDUPLICATE — remove overlapping findings, keep the best-stated version
3. PRIORITIZE — rank all findings by actual impact, not theoretical risk
4. CHALLENGE — flag any recommendation you disagree with and explain why
5. SYNTHESIZE — produce a single actionable review

Pipeline map: <include pipeline-map.md content>

Reviews:
- Software: <include software-review.md>
- Database: <include db-review.md>
- Clean Code: <include clean-code-review.md>

Produce the final review with this structure:

# Pipeline Review: Final Report

## Executive Summary
2-3 sentences: overall health, biggest risk, biggest opportunity for simplification.

## Critical Changes (do these now)
Numbered list. Each item: file, line, what to change, why it matters.
These are things that could cause bugs, data loss, or performance degradation.

## Simplification Opportunities (do these next)
Numbered list. Each item: file, line, current code, proposed simplification.
These make the code meaningfully simpler without changing behavior.

## Minor Improvements (do these when convenient)
Numbered list. Brief descriptions.

## Disagreements with Specialist Reviews
If any specialist recommendation is wrong or counterproductive, explain why here.

## Architecture Notes
Any structural observations about the pipeline design itself —
not individual code issues, but how the steps fit together.

Save to: reviews/<date>-pipeline-review/final-review.md
```

## After Phase 2

1. **Present the final review** to the user with a brief summary of:
   - How many critical/simplification/minor items were found
   - The top 3 most impactful changes
2. **Ask the user** which changes they want to implement
3. If the user says "do it" or "implement all", work through the changes in priority order, committing logical groups together

## Important Guidelines

- Every finding must have a concrete fix, not just an observation. "This function is too complex" is useless. "Split this function into X and Y, here's how" is useful.
- Prefer simplification over addition. If you can delete code to fix a problem, that's better than adding code.
- Don't review test files unless the user explicitly asks. Focus on production pipeline code.
- If the pipeline has no database interactions, skip the db-engineering agent and note this in the pipeline map.
