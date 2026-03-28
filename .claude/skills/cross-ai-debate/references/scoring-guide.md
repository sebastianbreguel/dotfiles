# Scoring Guide for Debate Rounds

Both debaters score the pipeline against these dimensions each round.
Scores should shift between rounds as arguments surface new evidence.

**Two scoring layers** (from `benchmark/docs/superpowers/specs/2026-03-18-llm-judge-layer-design.md`):
- **Heuristic** — structural presence/absence (reproducible, deterministic)
- **LLM-as-Judge** — semantic quality (captures what heuristics miss)
- **Combined** — 0.4 x heuristic + 0.6 x LLM (LLM gets higher weight because semantic quality matters more)

The most interesting debate happens where heuristic and semantic scores **diverge**.
A high heuristic + low semantic score means "the data is there but it's not good."
A low heuristic + high semantic score means "quality is good but coverage is poor."

## Product Rubric Dimensions (from BENCHMARK_RUBRIC.md)

Score 1-5 each. These map to the 12 weighted benchmark questions.

| Dimension | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) |
|-----------|----------|-----------------|---------------|
| **Distinctiveness** | Numbered clusters (X-2, X-3), >70% title overlap | Mostly unique, 1-2 near-duplicates | Every category clearly different, no overlap |
| **Coverage** | >25% noise, all clusters from same theme | 15-25% noise, mostly distinct topics | <15% noise, diverse themes, good FAQ coverage |
| **Actionability** | Generic advice ("mejorar comunicacion") | Some specificity, mejora present | acciones[] with items, urgencia cited, [categoria] refs |
| **Faithfulness** | Hallucinated numbers, categories not in data | Numbers present but ±5-10% off | Every % matches CSV within ±3% |
| **Resolution Quality** | No correlation with sentiment, high indeterminado | Some correlation, <15% indeterminado | Strong sentiment correlation, <5% indeterminado |
| **Temporal & Entity** | No trends, no entity names in narratives | Basic temporal present, some entities | Trend direction per cluster, top_entities in narratives |
| **Completeness** | Multiple empty fields, missing sections | Most fields populated, 1-2 gaps | All 11 dashboard keys, FAQ per cluster, no gaps |

## Structural Benchmark Dimensions (from BENCHMARK.md)

Score presence (0/0.33/0.66/1.0) x quality for each:

### Extraction (12 dimensions)
Topics, Sentiment, Entities, Resolution, Intent, Questions, Temporal, KPIs,
Escalamiento, Narrativa, Acciones, Clusters

### Analysis (8 dimensions)
Por agente, workflow/stage, producto/feature, oportunidad, problema,
industria/canal, tiempo, meta-categoria

### Metadata Quality (5 dimensions)
Confidence, Severity, Evidence/details, Source, Polarity granular

## Consistency Metrics (v2 internal)

| Metric | Good | Acceptable | Problem |
|--------|------|------------|---------|
| Fleiss kappa resolution | >0.80 | 0.60-0.80 | <0.60 |
| Fleiss kappa sentiment | >0.75 | 0.55-0.75 | <0.55 |
| Topic stability | >85% | 70-85% | <70% |
| NDCG@5 rankings | >0.90 | 0.75-0.90 | <0.75 |
| KPI std dev | <1% | 1-3% | >3% |
| Claim grounding rate | >90% | 75-90% | <75% |

## v1 vs v2 Gap Analysis

Key dimensions where v1 outperforms v2 (from BENCHMARK.md Section 6):

| Gap | v1 Has | v2 Impact | Priority |
|-----|--------|-----------|----------|
| Agent performance | avgSentiment, badResponses per agent | High — CS needs this | P1 |
| Workflow/stages | 825 workflow_step annotations | Medium — flow optimization | P2 |
| Confidence metadata | 0-1 per annotation (avg 0.9) | Medium — filter low-quality | P2 |
| Severity metadata | low/medium/high/critical | Medium — prioritization | P3 |
| Evidence/details | Text + quotes per annotation | Low — traceability | P3 |
| Product/feature dims | 2531 product + 761 feature | High — product intelligence | P1 |

Debaters should reference these gaps and propose whether/how v2 should close them.
