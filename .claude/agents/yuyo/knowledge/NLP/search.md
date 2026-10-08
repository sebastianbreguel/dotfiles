---
updated: 2026-08-16
ttl: 24 months
sources: 9
---

# Yuyo — NLP / Text search

**What it covers.** The mechanics of search itself: BM25 as the baseline to beat, fusion of lexical and semantic rankings with Reciprocal Rank Fusion, cross-encoder reranking, trigram indexes for substring matching, hard `tsvector` limits, and the degradation of dense retrieval as the index grows.

**When to read it.** When the diff touches a search query, a full-text search configuration, an `ILIKE '%…%'`, a ranking fusion, a reranker, or a plan to replace search with embeddings. Always after `CORE.md`.

> The use of these stages inside a RAG pipeline — what enters the index, chunking, `k`, index freshness — is in `LLM/retrieval.md`.

**Identifiers.** Entries in this file are cited as `SR<n>`. Cross-file references name the file (`NLP/representations.md` RP7, `LLM/retrieval.md` D2).

**Note on the distribution of backings in this specialty.** Almost everything here is `source` and almost nothing is `evidence`: the team has no record of asking for anything about search. That does not weaken the principles — they have a paper or official documentation behind them — but you explain the mechanism and cite the source rather than invoking precedent that does not exist.

---

## SR1. BM25 is the baseline to beat, not the starting point to discard

**What it requires.** Every proposal to replace search with embeddings compares against BM25 — or against PostgreSQL full-text search, which is usually what is already in use — over real user queries.

**When it applies.** A PR or plan that says "let's replace search with embeddings" with no comparison table.

**Why it bites.** BM25 is a probabilistic ranking model with decades of validation, and in zero-shot evaluation over heterogeneous domains it remains a robust baseline that many dense models do not beat outside their training domain. Migrating without comparing usually swaps a search that works for one that "understands" and fails on identifiers.

**Backing.** `source` — Robertson and Zaragoza, *The Probabilistic Relevance Framework: BM25 and Beyond*, Foundations and Trends in IR, vol. 3, no. 4, 2009, DOI 10.1561/1500000019 — https://www.nowpublishers.com/article/Details/INR-019 (full text behind a paywall; see the limitations section). Modern empirical evidence: Thakur et al., *BEIR*, arXiv:2104.08663 — https://arxiv.org/abs/2104.08663, which evaluates 10 systems over 18 datasets and concludes that "BM25 is a robust baseline" and that dense and sparse models "often underperform other approaches".

---

## SR2. Fuse lexical and semantic with Reciprocal Rank Fusion before training anything

**What it requires.** When there are two rankings, combine them with RRF (`Σ 1/(k + rank)`, with `k = 60`) before inventing weights.

**When it applies.** Somebody is about to write an ad hoc combination formula like `0.7 * semantic_score + 0.3 * lexical_score`.

**Why it bites.** The scores of two different systems are not comparable with each other: adding them with weights mixes scales and the result depends on the accidental calibration of each engine. RRF uses only the ordering, needs no training, and in the original paper it consistently outperforms each individual system.

**Backing.** `source` — Cormack, Clarke and Büttcher, *Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods*, SIGIR '09 — http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf. Verbatim: `RRFscore(d ∈ D) = Σ_{r∈R} 1/(k + r(d))`, "where k = 60 was determined during a pilot investigation and was not altered during subsequent validation"; and "the constant k mitigates the impact of high rankings by outlier systems". It is the default hybrid fusion method in modern search engines.

---

## SR3. Rerank the top-k with a cross-encoder

**What it requires.** A two-stage pattern: retrieve hundreds of candidates with a fast method and reorder the first ones with a model that sees the query and the document together.

**When it applies.** Search brings back the right document but at position 8 and the user only looks at the first 3. Measurable trigger: good recall@50 and bad precision@3.

**Why it bites.** Retrieving is cheap and approximate; ranking well is expensive. Without the second stage, raising `k` to improve recall only injects noise into the first positions, which are the only ones the user sees.

**Backing.** `source` — Nogueira and Cho, *Passage Re-ranking with BERT*, arXiv:1901.04085 — https://arxiv.org/abs/1901.04085. Implementation: Sentence Transformers, *Cross Encoder Usage* — https://sbert.net/docs/cross_encoder/usage/usage.html, which describes the key characteristic: "computes a similarity score given pairs of inputs". Confirmation on a heterogeneous benchmark: BEIR (arXiv:2104.08663) reports that reranking and late-interaction models "achieve the best zero-shot performances on average, but at high computational costs". The use of this stage inside a RAG pipeline is in `LLM/retrieval.md`.

---

## SR4. Full-text search does not do substring search; that is what trigram indexes are for

**What it requires.** Every query with `ILIKE '%text%'`, `LIKE '%text%'`, `similarity()` or the `%` operator comes with `CREATE EXTENSION pg_trgm` plus the GIN index over that column.

**When it applies.** A new `ILIKE '%…%'` with no migration creating the index. The leading wildcard is the observable detail: a B-tree index cannot use it. Also the product requirement "find it even if I misspell the surname" or "match a piece of the SKU".

**Why it bites.** Without a trigram index it is a sequential scan: it works perfectly against the development table and degrades linearly with the biggest client's volume. The query goes from 5 ms to 4 s with no code change, and since search is usually on an interactive endpoint the symptom is a timeout, not slowness. Local aggravating factor: in this repository the `statement_timeout` lives in the replica pool, so a raw `SELECT` that goes to the master does not even have that brake.

**Backing.** `source + consensus` — PostgreSQL 18, *F.35. pg_trgm* — https://www.postgresql.org/docs/current/pgtrgm.html: "a trigram is a group of three consecutive characters taken from a string"; "`pg_trgm` ignores non-word characters (non-alphanumerics) when extracting trigrams"; "these index types also support index searches for `LIKE`, `ILIKE`, `~`, `~*` and `=` queries"; and the default threshold of the `%` operator is `pg_trgm.similarity_threshold = 0.3`. Complemented by *12.3. Controlling Text Search* — https://www.postgresql.org/docs/current/textsearch-controls.html. **Watch the detail that it ignores non-alphanumerics:** for codes with hyphens that changes the trigram set. Local convention: read-only raw SQL is routed through `queryReplica`/`queryReplicaRepo` (`src/utils/query-replica.ts`), documented in `CLAUDE.md`.

---

## SR5. Know the hard `tsvector` limits before indexing large documents

**What it requires.** Long documents are chunked into rows before being indexed; you do not bet on them fitting into a single `tsvector` column.

**When it applies.** Full call transcripts, PDFs or long conversation threads are about to be indexed into a single column.

**Why it bites.** The limits fail at runtime, not at design time, and they are reached sooner than you expect. It is the concrete instance of C16 on the index side.

**Backing.** `source` — PostgreSQL 18, *12.11. Limitations* — https://www.postgresql.org/docs/current/textsearch-limitations.html. The limits: each lexeme under 2 KB; total `tsvector` length (lexemes plus positions) under 1 MB; number of lexemes under 2^64; position values greater than 0 and no more than 16,383; match distance of the `<N>` (FOLLOWED BY) operator no greater than 16,384; no more than 256 positions per lexeme; and the number of nodes of a `tsquery` under 32,768.

---

## SR6. The advantage of dense search degrades as the index grows

**What it requires.** The quality of a semantic search is re-measured after the corpus grows by an order of magnitude, not only at the POC.

**When it applies.** The semantic search POC was validated with 5,000 documents and the plan is to scale to millions, without re-measuring.

**Why it bites.** As index size increases, the performance of low-dimensional dense retrieval drops faster than that of lexical methods. The degradation is gradual and error-free: search keeps responding, with steadily worse results, and nobody associates it with the growth of the corpus.

**Backing.** `source + debated` — Reimers and Gurevych, *The Curse of Dense Low-Dimensional Information Retrieval for Large Index Sizes*, arXiv:2012.14210 — https://arxiv.org/abs/2012.14210.
- *Position A:* low dimensionality limits the ability to discriminate among many documents; you have to raise the dimension or keep the lexical component.
- *Position B:* dense models trained with hard negatives and at larger scale have closed much of that gap since 2020, so the result does not extrapolate to current models without re-measuring.
- **Recommendation:** keep the lexical component and fuse with RRF (SR2); re-measure after every jump in scale. **Tradeoff:** one more engine to operate, in exchange for the degradation not being silent.

---

## Sources that could not be opened or verified

Documented explicitly so as not to present as verified what is not. Preserved intact; these are the items that belong to search.

1. **ACM Digital Library, RRF record** (DOI 10.1145/1571941.1572114): returned **HTTP 403**. The paper's content was verified against the author's copy at http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf, from which the full text was extracted (title, authors, venue SIGIR'09, formula and constant `k = 60`).
2. **Robertson and Zaragoza (2009), full text**: the publisher's page (https://www.nowpublishers.com/article/Details/INR-019) did open and confirms title, authors, venue (*Foundations and Trends in Information Retrieval*), year and DOI, but the full text is behind a paywall. The claims about BM25 rest on BEIR's empirical evidence, which was read in full, not on Robertson and Zaragoza's text.

**Consultation date for this section's sources:** August 15, 2026. The PostgreSQL limits correspond to the versions cited and must be verified against the version in use.
