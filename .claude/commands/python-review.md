Review the Python code in $ARGUMENTS for quality, security, and best practices specific to the Vambe datascience stack.

## Project Context

- **Stack**: FastAPI + Prefect + PostgreSQL/pgvector + SQLAlchemy (async)
- **Style**: ruff + isort + black, line length 140, double quotes, Python 3.10+
- **Domain**: Spanish-first NLP analytics pipeline (classify, embed, cluster, narrate)
- **LLM calls**: via `call_llm`, `call_llm_batch_structured` from `src.llm`
- **Auth**: API key via `require_api_key` dependency (deps.py)
- **DB**: async sessions via `db.py`, 3 owned tables + 341 read-only CRM tables
- **Monorepo**: `packages/dashboard-backend/`, `packages/dashboard-frontend/`

## Checklist

### Style & Vambe Conventions
- [ ] ruff/black compliant (140 char lines, double quotes)
- [ ] Type hints on all function signatures (use `str | None` not `Optional[str]`)
- [ ] No unused imports or variables
- [ ] Conventional commit style if touching commits
- [ ] Pipeline stages follow existing pattern: read parquet → process → write parquet

### Security
- [ ] No hardcoded secrets, tokens, or API keys
- [ ] SQL uses parameterized queries (no f-strings in raw SQL)
- [ ] All endpoints use `require_api_key` dependency from `deps.py`
- [ ] Rate limiting applied via `require_rate_limit` where needed
- [ ] No command injection via subprocess/os.system
- [ ] File paths sanitized (no path traversal in data_dir lookups)
- [ ] CRM tables are READ-ONLY — no writes to non-owned tables

### FastAPI Patterns
- [ ] Pydantic models in `src/models/` for request/response schemas
- [ ] Dependencies injected via `deps.py` (auth, rate limiting, DB)
- [ ] Async endpoints where I/O bound
- [ ] Proper HTTP status codes and structured error responses
- [ ] SSE streaming via `src/routers/streaming.py` helpers where needed

### Pipeline Stages
- [ ] Stage uses `PipelineContext` for config and paths
- [ ] LLM calls use `call_llm_batch_structured` with proper schema
- [ ] Prompts are in Spanish (domain requirement)
- [ ] Checkpoint/resume via `CheckpointManager` for batch processing
- [ ] Stage writes output as parquet/JSON to `PipelineContext.data_dir`
- [ ] File existence = cache (don't recompute if output exists)

### Database & SQLAlchemy
- [ ] Async sessions properly awaited and closed
- [ ] No N+1 patterns (use joinedload/selectinload)
- [ ] Writes only to owned tables: `analysis_tickets`, `analysis_clusters`, `rag_embeddings`
- [ ] pgvector operations use proper vector types
- [ ] Raw SQL via `raw_conn()` from `db.py` when needed

### LLM & Embeddings
- [ ] LLM tier appropriate: `fast` for simple, `smart` for nuanced, `best` for critical
- [ ] Structured output uses Pydantic schema with `call_llm_batch_structured`
- [ ] Batch calls preferred over sequential for throughput
- [ ] Usage tracking via `get_usage_report()`
- [ ] Embeddings via Jina (1024d vectors)
- [ ] UMAP + HDBSCAN parameters follow clustering best practices

### Error Handling
- [ ] Try/except catches specific exceptions (not bare except)
- [ ] Errors logged with context (stage, run_id, batch info)
- [ ] API errors return structured JSON
- [ ] LLM calls have retries and fallback handling
- [ ] Pipeline failures are recoverable (checkpoint exists)

### Performance
- [ ] No blocking I/O in async functions
- [ ] Large datasets paginated or streamed
- [ ] `_cached()` pattern used for repeated data loads (see insights.py)
- [ ] Parquet used for intermediate data (not CSV)
- [ ] Batch LLM calls sized appropriately (not too large, not one-by-one)

## Output Format
For each finding, report:
- **File:line** — description of issue
- **Severity**: critical / high / medium / low
- **Fix**: specific suggestion

End with a summary: total findings by severity, overall assessment.
