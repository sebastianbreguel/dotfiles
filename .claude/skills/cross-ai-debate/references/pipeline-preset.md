# Pipeline Benchmark Debate Preset

Pre-configured task + criteria for debating the benchmark methodology of the vambe-datascience pipeline.

Use with `/cross-ai-debate` by saying: "debate the pipeline benchmark" or "debate with pipeline preset"

## Task

Evaluate and improve the benchmark system at `benchmark/` that compares three pipeline versions (v0, v1, v2) for extracting insights from customer conversation data.

The pipeline processes raw chat conversations and extracts: topics, sentiment, entities, resolution status, intent, questions, temporal patterns, KPIs, escalation signals, narratives, actions, and clusters — producing a `dashboard_data.json` that powers an insights dashboard.

**The core question**: Is our benchmark methodology sound? Does it correctly measure what matters — using real NLP metrics, not subjective opinions?

### What the debate should produce

A concrete evaluation of the benchmark across three layers:

---

## Criteria: Three Evaluation Layers

### Layer 1 — Universal Inventory (Coverage Map)

**Goal**: A complete table of ALL possible extraction dimensions across all versions.

The debaters should evaluate whether the benchmark correctly maps:

| Dimension | v0 | v1 | v2 | Metric Type |
|-----------|----|----|----|----|
| Topics | ? | ? | ? | ... |
| Sentiment | ? | ? | ? | ... |
| ... | | | | |

For each cell: does the version extract it? At what depth? (absent / basic / structured / quantified+temporal)

**Metrics to evaluate this layer**:
- Completeness: does the inventory miss any dimension that any version extracts?
- Depth accuracy: is the depth scale (0/0.33/0.66/1.0) appropriate or too coarse?
- Fairness: does the scale advantage versions that output more fields even if quality is poor?

---

### Layer 2 — Internal Quality (Per-Version, Standalone)

**Goal**: For each version independently, measure HOW WELL it extracts what it extracts. This layer must work standalone — you can run it on v2 alone without needing v0/v1.

The debaters should evaluate whether the benchmark uses appropriate NLP metrics for each extraction type:

#### Deterministic Metrics (computed from data, reproducible)

| What to measure | Appropriate NLP metrics | Currently in benchmark? |
|-----------------|------------------------|------------------------|
| **Topic coherence** | Topic Coherence (C_v, NPMI, UCI), intra-cluster cosine similarity, silhouette score | ? |
| **Topic distinctiveness** | Inter-cluster cosine distance, pairwise Jaccard on top-k terms, duplicate detection via embedding similarity > threshold | ? |
| **Sentiment accuracy** | Cohen's kappa (vs reference), distribution entropy, correlation with resolution | ? |
| **Sentiment granularity** | Number of distinct labels, coverage of polarity spectrum | ? |
| **Entity extraction** | Precision/Recall/F1 (exact + fuzzy via Levenshtein), entity type coverage | ? |
| **Resolution labels** | Fleiss kappa (multi-run consistency), label distribution balance, correlation with sentiment | ? |
| **KPI grounding** | Absolute delta vs raw data counts, claim verification rate (regex-extracted numbers matched to source) | ? |
| **Temporal patterns** | Trend direction accuracy, temporal coverage (% of time range with data points) | ? |
| **Completeness** | Field fill rate, null/empty ratio per section, schema validation pass rate | ? |
| **Cluster quality** | Silhouette score, Davies-Bouldin index, DBCV (for HDBSCAN), noise ratio | ? |
| **Consistency** (multi-run) | Fleiss kappa, NDCG@K ranking stability, topic Jaccard across runs, KPI std dev | ? |

#### Qualitative Metrics (still NLP-based, still computable)

| What to measure | Appropriate NLP metrics | Currently in benchmark? |
|-----------------|------------------------|------------------------|
| **Narrative quality** | ROUGE-L (vs source conversations), BERTScore, information density (unique claims per paragraph) | ? |
| **Narrative faithfulness** | Claim grounding rate (% of numeric claims traceable to data), entity grounding (% of named entities in source) | ? |
| **Actionability** | Specificity score (named entities + numbers + timeframes per action), verb concreteness, presence of urgency/priority signals | ? |
| **Category naming** | Embedding distance from generic terms ("otros", "general"), naming diversity (unique unigrams/total), Spanish NLP quality | ? |
| **FAQ relevance** | Semantic similarity to source conversations (embedding cosine), question diversity, answer grounding | ? |
| **Summary coherence** | Sentence-level coherence (consecutive sentence similarity curve), discourse marker presence, logical flow | ? |

**Key principle**: Even "qualitative" dimensions should have computable NLP metrics. "Is this narrative good?" becomes "ROUGE-L against source + claim grounding rate + information density."

---

### Layer 3 — Cross-Version Comparison

**Goal**: When two or more versions extract the same dimension, compare them fairly. A new dimension in v2 that's poorly extracted should NOT count as an advantage.

The debaters should evaluate:

#### Comparison Metrics

| Comparison type | Metrics | Notes |
|----------------|---------|-------|
| **Same dimension, both versions** | Head-to-head metric comparison (higher kappa, higher F1, better coherence wins) | Straightforward |
| **New dimension in v2 only** | Layer 2 internal quality score must exceed minimum threshold to count as improvement | Prevents "more but worse" |
| **Dimension removed in v2** | Flag as regression unless replaced by a better alternative | Don't silently drop capabilities |
| **Aggregate scoring** | Weighted: quality weight > presence weight (e.g., 0.7 quality × 0.3 presence) | Quality over quantity |

#### Scoring Formula Evaluation

The current benchmark uses: `final_score = presence × quality`

The debaters should evaluate whether this is correct or if a better formula would be:
- `final_score = presence × quality^2` (penalizes low quality harder)
- `final_score = min(quality_threshold, 1) × presence × quality` (gate: quality must pass minimum)
- Something else entirely

**The anti-pattern to prevent**: Version A extracts 25 dimensions at 0.4 quality each, Version B extracts 12 dimensions at 0.8 quality each. The benchmark should NOT say A is better.

---

## Evidence Files

**Benchmark code** (the subject being debated):
- `benchmark/BENCHMARK.md` — full benchmark design spec
- `benchmark/config.yaml` — thresholds, weights, regex patterns
- `benchmark/run_benchmark.py` — orchestration
- `benchmark/scoring/` — all scoring modules (coverage, quality, consistency, sanity, claims, rubric)
- `benchmark/normalization/` — data normalization per version

**Benchmark data**:
- `benchmark/v0/` — v0 outputs
- `benchmark/v1/` — v1 outputs (2,335 tickets with annotations)
- `benchmark/v2_runs/` — v2 outputs (3 independent runs)

**Pipeline code** (what produces the outputs):
- `packages/dashboard-backend/src/pipeline_system/stages/` — all 8 pipeline stages
- `packages/dashboard-backend/src/pipeline_system/prompts.py` — LLM prompts
- `packages/dashboard-backend/src/pipeline_system/flows.py` — orchestration

**Existing design docs**:
- `benchmark/docs/superpowers/specs/2026-03-18-llm-judge-layer-design.md` — LLM judge spec (currently NOT implemented, benchmark is pure deterministic)

## What the Debate Report Should Deliver

1. **Gap analysis**: Which NLP metrics are missing from the current benchmark?
2. **Metric appropriateness**: Are the current metrics the right ones for each dimension?
3. **Layer 2 standalone viability**: Can we evaluate v2 internally without v0/v1?
4. **Scoring formula**: Is `presence × quality` the right aggregate, or should quality weigh more?
5. **Anti-regression safeguards**: Does the benchmark correctly prevent "more but worse"?
6. **Concrete recommendations**: Ordered list of what to add/change, with specific metric names and Python libraries

## Roles

```
roles:
  claude: ai-ml-expert
  codex: ai-researcher
  gemini: ops-impact-analyst
```

See `references/agent-roles.md` for full expertise descriptions to inject into prompts.

## Parameters

```
Subject: benchmark/
Rounds: 2
Mode: adversarial
```
