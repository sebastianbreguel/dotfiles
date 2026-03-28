---
name: project-docs
description: Generates two reference documents for any project: `vambe.md` (comprehensive project overview for AI context) and `db.md` (full database schema reference). Use this skill whenever the user asks to "generate project docs", "regenerate vambe.md", "update db.md", "document the project", "create context files", or uses /project-docs. Also trigger when the user says their AI assistant needs context about a project, or when working in a new repo and needing to produce onboarding reference files. Runs codebase exploration and database analysis in parallel, then writes the files directly into the project.
---

# project-docs

Generate `vambe.md` and `db.md` — two reference documents that give AI assistants (and humans) deep, structured context about a project.

## What each file contains

**vambe.md** — Project intelligence document:
- What the project does and who it's for
- Architecture overview and component map
- Tech stack with versions and rationale
- Key data flows and integration points
- Domain-specific terminology and concepts
- Gotchas, constraints, and non-obvious design decisions

**db.md** — Database schema reference:
- All tables/collections with purpose descriptions
- Columns: name, type, nullable, default, constraints
- Foreign keys and relationships (with cardinality)
- Indexes and their purpose
- Notable patterns (soft deletes, timestamps, multi-tenancy, etc.)
- Key queries or access patterns if inferable

## Steps

### 1. Resolve the target path

Use the path argument if provided. If not, use the current working directory.

```
path = args or cwd
```

### 2. Run both agents in parallel

Launch these two agents **in the same message** so they run concurrently:

**Agent A — Explore (for vambe.md):**
```
Task: Produce a comprehensive project overview document for vambe.md.

Project path: <path>

Explore the entire codebase deeply. Read READMEs, configs, entrypoints, package manifests, key source files, and any existing docs. Your output should be a markdown document covering:
- Project purpose and users
- Architecture (services, layers, components)
- Tech stack with versions
- Key data flows and integrations
- Domain concepts and terminology
- Non-obvious design decisions or constraints

Write the document directly to: <path>/vambe.md
Be thorough — this file will be loaded as AI context for future sessions.
```

**Agent B — db-engineering (for db.md):**
```
Task: Produce a comprehensive database schema reference for db.md.

Project path: <path>

Find all database schema definitions: SQL migration files, ORM model files (SQLAlchemy, Prisma, Django ORM, TypeORM, Drizzle, etc.), schema.rb, *.sql files, or any existing schema docs. Your output should be a markdown document covering:
- All tables/collections with a one-line purpose
- Columns: name, type, nullable, default, constraints
- Foreign keys and relationships with cardinality notes
- Indexes and why they exist
- Notable patterns (soft deletes, audit fields, multi-tenancy, etc.)

Write the document directly to: <path>/db.md
If no database is found, write db.md saying "No database schema detected" with what was checked.
```

### 3. Sync docs-site (CRITICAL)

After both agents finish, check if a `docs-site/` directory exists inside `<path>`. If it does, run a **docusaurus-expert** agent to:

1. **Add vambe.md and db.md as raw reference pages** in the docs-site:
   - Copy/symlink the content of `<path>/vambe.md` → `<path>/docs-site/docs/reference/project-context.md`
   - Copy/symlink the content of `<path>/db.md` → `<path>/docs-site/docs/reference/database-schema.md`
   - Add Docusaurus frontmatter to each (`title`, `sidebar_label`, `sidebar_position`)
   - Register them in the sidebar under a "Reference" category if a sidebar config exists

2. **Sync updated content into existing docs-site pages** — map from `vambe.md` and `db.md` into the matching docs-site pages:
   - `docs/architecture/overview.md` ← architecture section of vambe.md
   - `docs/architecture/data-flow.md` ← pipeline/data flow section of vambe.md
   - `docs/architecture/tech-stack.md` ← tech stack section of vambe.md
   - `docs/ml-pipeline/*.md` ← corresponding ML pipeline sections of vambe.md
   - `docs/database/schema.md` ← datascience-owned tables from db.md
   - `docs/database/queries.md` ← query patterns from db.md
   - Preserve all Docusaurus frontmatter; only update body content

This step is not optional — the docs-site must always reflect the same information as vambe.md and db.md.

### 4. Update .gitignore (if applicable)

After all agents finish, check if `<path>/.gitignore` exists. If it does, add these entries if not already present:

```
# Linter cache
.ruff_cache/
```

### 5. Report

Tell the user:
- `vambe.md` written ✓
- `db.md` written ✓
- docs-site synced ✓ (or "no docs-site found")
- `.gitignore` updated (or not applicable)
