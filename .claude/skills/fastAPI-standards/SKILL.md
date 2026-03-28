---
name: fastAPI-standards
description: >
  Guide for building and refactoring a FastAPI + Prefect + PostgreSQL/pgvector analytics pipeline
  that extracts insights from chat data using LLM classification, embeddings, UMAP/HDBSCAN clustering,
  and narrative generation. Use this skill whenever working on this project's codebase — including
  adding features, refactoring, debugging, creating new endpoints, modifying pipeline stages,
  or reviewing architecture decisions. Also trigger when the user asks about project structure,
  stack decisions, async migration, or best practices for this specific system.
---

# FastAPI Pipeline Architect

This skill guides development of an analytics backend that processes customer chat data through
a multi-stage pipeline: ingestion → preprocessing → classification → embedding → clustering →
labeling → narrative generation, served via FastAPI with results stored in PostgreSQL + pgvector.

## Stack

| Layer              | Technology                                      |
|--------------------|------------------------------------------------|
| API                | FastAPI + asyncpg + SQLAlchemy (async) + Alembic |
| Orchestration      | Prefect                                         |
| Database           | PostgreSQL + pgvector                           |
| Embeddings         | Jina AI (or configurable provider)              |
| Clustering         | UMAP + HDBSCAN                                  |
| LLM                | Anthropic SDK (Claude)                          |
| Frontend LLM       | Vercel AI SDK                                   |
| Validation         | Pydantic v2 + pydantic-settings                 |
| Testing            | pytest + pytest-asyncio + httpx                  |

## Target Project Structure

When creating new files or refactoring, follow this layout:

```
.
├── Dockerfile
├── pipeline_config.yaml
├── pyproject.toml
├── alembic/
│   ├── alembic.ini
│   ├── env.py
│   └── versions/
└── src/
    ├── __init__.py
    ├── main.py                    # FastAPI app entrypoint, mounts routers
    ├── config.py                  # Pydantic BaseSettings, single source of truth
    ├── deps.py                    # FastAPI dependencies (get_db, get_llm, auth)
    ├── db.py                      # Async engine + session factory (asyncpg)
    ├── models/                    # Pydantic v2 schemas — all validation here
    │   ├── __init__.py
    │   ├── pipeline.py            # PipelineRun, StageResult, ClusterOutput...
    │   ├── chat.py                # ChatRequest, ChatResponse...
    │   ├── insights.py            # InsightQuery, InsightResponse...
    │   └── rag.py                 # RAGQuery, RAGResult...
    ├── services/                   # Shared business logic, no duplication
    │   ├── __init__.py
    │   ├── embeddings.py          # ONE embedding service (used by RAG + pipeline)
    │   ├── llm.py                 # ONE LLM client factory (used everywhere)
    │   └── cache.py               # Cache layer (Redis or PG-based)
    ├── routers/
    │   ├── __init__.py
    │   ├── chat.py
    │   ├── insights.py
    │   ├── pipeline_runs.py
    │   ├── rag_chat.py
    │   └── streaming.py
    ├── rag/
    │   ├── __init__.py
    │   ├── ingest.py
    │   ├── retriever.py
    │   └── store.py
    └── pipeline_system/
        ├── __init__.py
        ├── config.py              # Pipeline-specific config (extends base)
        ├── flows.py               # Prefect flows
        ├── tasks.py               # Prefect tasks
        ├── stages/                # One file per pipeline stage
        │   ├── __init__.py
        │   ├── preprocessor.py
        │   ├── classifier.py
        │   ├── embedder.py        # Calls services/embeddings.py
        │   ├── clusterer.py       # UMAP + HDBSCAN logic
        │   ├── labeler.py
        │   ├── narrator.py
        │   └── dashboard_generator.py
        ├── prompts.py
        ├── utils.py
        ├── db/
        │   ├── __init__.py
        │   ├── fetcher.py
        │   ├── service.py
        │   └── writer.py
        └── spanish_preprocessor/
            ├── __init__.py
            ├── preprocess.py
            ├── chat_abbreviations.py
            ├── emo_unicode.py
            ├── inclusive_words.py
            └── stopwords.py
```

Key structural rules:
- **No duplicate services.** `services/embeddings.py` is the ONE place embeddings are created. Both `rag/` and `pipeline_system/stages/embedder.py` import from it.
- **No duplicate LLM clients.** `services/llm.py` is the ONE place LLM clients are initialized. Everything else imports from it.
- **All Pydantic schemas live in `models/`.** Routers, pipeline stages, and services import from there.
- **Config flows down.** `src/config.py` holds all env vars. `pipeline_system/config.py` extends it for pipeline-specific settings. Nothing else reads env vars directly.

## Architecture Rules

Read `references/architecture.md` for detailed implementation patterns covering:
- Async SQLAlchemy setup
- Config with Pydantic BaseSettings
- Dependency injection
- Pipeline run isolation
- Embedding versioning
- Auth patterns
- Error handling
- Testing patterns

## Refactoring Checklist

When refactoring the existing codebase toward this target structure, follow this order.
Each step is safe to do independently without breaking functionality.

### Phase 1: Foundation (no behavior changes)
1. Create `src/config.py` with `BaseSettings` — move all env var reads here
2. Create `src/models/` and extract all Pydantic schemas into it
3. Create `src/services/embeddings.py` — unify the two embedders
4. Create `src/services/llm.py` — unify the two LLM providers
5. Create `src/deps.py` — centralize FastAPI dependencies
6. Ensure `src/db.py` is the only place that creates engine/sessions

### Phase 2: Async + safety
7. Migrate `src/db.py` to async engine + sessions (asyncpg)
8. Add `pipeline_run_id` to all derived/output tables
9. Add `model_version` column to embedding tables
10. Add basic API key auth via `deps.py`

### Phase 3: Operational
11. Add `/health` and `/ready` endpoints
12. Add structured logging (structlog) for LLM calls
13. Lock down CORS to real domains
14. Add LLM response fixtures for deterministic tests

### Phase 4: Scale (when needed)
15. Cursor-based pagination on insight endpoints
16. Cache layer for expensive computations
17. Semaphore-based concurrency limiter per external API
18. HDBSCAN parameter auto-tuning based on data volume
19. PgBouncer for connection pooling

## When Creating New Pipeline Stages

Every pipeline stage must:
1. Accept and return Pydantic models (defined in `src/models/pipeline.py`)
2. Be a Prefect `@task` with retries and result caching
3. Accept a `pipeline_run_id` parameter and tag all outputs with it
4. Use the shared embedding/LLM services (never instantiate clients directly)
5. Be idempotent — safe to re-run without side effects
6. Log structured metadata: stage name, input count, output count, duration, tokens used

## When Creating New Endpoints

Every FastAPI endpoint must:
1. Use Pydantic models for request/response (from `src/models/`)
2. Get DB session via `Depends(get_db)` from `deps.py`
3. Get auth via `Depends(get_api_key)` from `deps.py`
4. Never run pipeline logic synchronously — trigger via Prefect, serve results from DB
5. Use cursor-based pagination for list endpoints
6. Return consistent error responses using a shared exception handler

## When Modifying Database Schema

1. Always create an Alembic migration — never modify tables manually
2. Include `pipeline_run_id` on any table that stores pipeline outputs
3. Include `model_version` on any table that stores embeddings
4. Include `created_at` and `updated_at` timestamps on all tables
5. Use pgvector's `vector` type for embedding columns with appropriate HNSW index
