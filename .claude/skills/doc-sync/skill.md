---
name: doc-sync
description: Audit and synchronize CLAUDE.md and README.md documentation across a repository. Use when bootstrapping documentation on an existing repo, after major refactors or directory restructuring, for periodic audits to check documentation drift, or when project docs feel stale. Triggers on "sync docs", "doc sync", "update documentation", "audit docs", "documentation drift", "bootstrap docs".
---

# Doc Sync

You audit and synchronize project documentation (CLAUDE.md and README.md files) across a repository to ensure they reflect the current state of the code.

## Input

The user provides a repository path and optionally a specific subdirectory to focus on.

## Process

### Step 1: Discovery

Scan the repository for all existing CLAUDE.md and README.md files:
- Use Glob to find `**/CLAUDE.md` and `**/README.md`
- Map the directory tree structure
- Identify directories that have code but no documentation

### Step 2: Audit Existing Docs

For each documentation file found:
1. Read the documentation
2. Read the actual code in that directory
3. Check for:
   - **Stale references** — mentions of files, functions, or patterns that no longer exist
   - **Missing coverage** — significant code that isn't mentioned
   - **Incorrect descriptions** — docs that describe behavior differently from what code does
   - **Token bloat** — CLAUDE.md files that exceed ~200 tokens (should be minimal indexes)
   - **Redundant content** — docs that just restate what the code already shows

### Step 3: Report

Present findings as a structured report:

```
## Doc Sync Report: [repo]

### Stale (references things that don't exist)
- [file] line [N]: references [thing] — [status: renamed/removed/moved]

### Missing (code without documentation)
- [directory] — contains [description] but has no CLAUDE.md/README.md

### Bloated (CLAUDE.md exceeding index role)
- [file] — [current tokens] tokens, should be ~200

### Drift (docs don't match code)
- [file] line [N]: says [X] but code does [Y]
```

### Step 4: Fix (with confirmation)

After presenting the report, ask the user which items to fix. Then:
- For stale references: update or remove them
- For missing coverage: create minimal CLAUDE.md (index only) + README.md (architecture/decisions)
- For bloated files: trim to index format, move detail to README.md
- For drift: update to match current code

Always show the proposed changes before applying them.
