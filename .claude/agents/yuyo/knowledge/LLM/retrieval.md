---
updated: 2026-08-16
ttl: 6 months
sources: 5
---

# Yuyo — LLM / RAG and retrieval

**What it covers.** Assembling context for a generative model: measuring retrieval separately from generation, contextual chunking and hybrid retrieval, chunk size, the `k` and the zero-results branch, curating what enters the index, index freshness versus the source, what gets embedded versus what gets shown, evaluating retrieval with real queries, and embedding caching.

**When to read it.** When the diff touches a retrieval step, a chunker, an index write path, an embedding call, or the function that assembles retrieved context into a prompt. Always after `CORE.md`.

> The mechanics of search itself — BM25 as a baseline, fusion with RRF, cross-encoders, trigram indexes, `tsvector` limits, dense-search degradation as the index grows — is in `NLP/search.md`. This file holds what is specific to building context for a generative model.

**Identifiers.** Entries in this file are cited as `D<n>`. Cross-file references name the file (`prompts.md` A4, `agents.md` C-A9, `operations.md` F14, `NLP/search.md` SR2).

---

## D1. Retrieving is not answering: measure retrieval recall separately

**What it requires.** The pipeline has independent metrics: whether the right document was in the context, how faithfully the model used that context, and how good the generation was. A single end-to-end metric lets you fix nothing.

**When it applies.** The diff adds or modifies a retrieval step and the only eval that exists scores the final answer.

**Why it bites.** When quality drops, you do not know whether to touch the prompt or the index: two afternoons get spent on the wrong hypothesis. Worse: the prompt gets tuned to compensate for bad retrieval, which produces answers that sound confident over incorrect context — the most expensive failure mode in the system.

**Backing.** `source` — Es et al., *Ragas: Automated Evaluation of Retrieval Augmented Generation*, arXiv:2309.15217 — https://arxiv.org/abs/2309.15217, which proposes metrics for all three dimensions without depending on human reference annotations. The principle of separating retrieval from generation is broad consensus; the concrete Ragas metrics depend on an LLM judge and therefore inherit the biases in `evaluation.md`. Which retrieval metric to use is debated (recall@k, MRR, nDCG); that it has to be measured separately is not.

---

## D2. Add context to the chunk before indexing it, and combine lexical with semantic

**What it requires.** Every chunk carries a brief explanation that situates it inside its document before being vectorized, and retrieval combines embeddings with lexical search. If volume justifies it, a second reranking stage is added.

**When it applies.** The corpus is chunked and the chunks are self-referential ("the system", "this function", "the client") without naming the subject. Users search by identifiers or exact terms and vector search "approximates" them to something else: searching for `ERR_4021` returns documents about errors in general.

**Why it bites.** Chunking destroys context: a chunk that says "grew 3 % over the previous quarter" loses which company and which quarter it is talking about, and the model uses it anyway with full confidence. And embeddings alone fail at exact matches, which is exactly what a user types when they already know what they are looking for.

**Backing.** `source` — Anthropic, *Introducing Contextual Retrieval* (September 19, 2024) — https://www.anthropic.com/news/contextual-retrieval, with published methodology and data appendix. Measured numbers on top-20 retrieval failure rate: contextual embeddings alone, −35 % (5.7 % → 3.7 %); adding contextual BM25, −49 % (→ 2.9 %); adding reranking from top-150 to top-20, −67 % (→ 1.9 %). The stated indexing cost with prompt caching is USD 1.02 per million document tokens, under assumptions of 800 tokens per chunk and 8k documents. It is a single source and an interested party; indexing cost goes up.

---

## D3. Choose chunk size with an evaluation, and check which semantic unit it splits

**What it requires.** Chunk size and chunking strategy come from a measurement, not from the library default. The change comes with examples of real documents where you can see where the cut lands, and with a check that the semantic unit — a price table, a step of a procedure, a question/answer pair — is not split.

**When it applies.** The diff changes `chunkSize`, `overlap`, the separator, or moves from splitting by characters to splitting by tokens or paragraphs. Or the project's chunk size is the library default and nobody measured it.

**Why it bites.** The cut lands in the middle of a table: the retrieved chunk has the header and not the values, or the values with no idea what they refer to. The model answers confidently using an incomplete fragment, indistinguishable from a hallucination from the outside. And recall@k looks fine — the "right" chunk is there — while the answer is wrong.

**Backing.** `source + consensus` — Chroma, *Evaluating Chunking Strategies for Retrieval* — https://research.trychroma.com/evaluating-chunking, with published metrics (recall, precision, IoU) and full tables: `RecursiveCharacterTextSplitter` with 200-token chunks and no overlap performs consistently well, and large chunks with heavy overlap (800/400) have high recall (85–88 %) but terrible precision (~1.5 %). It is one of the few published systematic evaluations of the topic; it is an interested party (it sells a vector database). Verifying the semantic unit is `consensus`.

---

## D4. A fixed `k` needs a reason, and the zero-results case needs a branch

**What it requires.** The number of retrieved documents comes from a recall@k measurement, not from a default. And there is an explicit path for when retrieval brings back nothing relevant, distinct from "it retrieved k bad documents", ending in an honest abstention.

**When it applies.** A `limit: 5` or `topK = 3` with no comment and no named constant; code that passes whatever came back into the prompt without distinguishing "little came back" from "nothing came back"; a `top_k` raised "just in case".

**Why it bites.** With a small `k`, the right document is left out on the longest queries and the model answers with the second best. With a large `k`, the context fills with noise, the model anchors on the wrong document, and the position effect also weighs in (`prompts.md` A4). With no zero-results branch, the system always has "context" and always answers: it never says it does not know, which is the correct answer when the index does not have the information.

**Backing.** `source + evidence`.
- `evidence` (partial, for the abstention branch) — "mejoraria el prompt en especial unresolved, deberia ser cuando no tienes la informacion para responder en tu prompt" — PR #12338 (BE), `assistant-skill-discovery.service.ts` (Lucas).
- `source` — Liu et al., arXiv:2307.03172 (positional degradation as context grows) — https://arxiv.org/abs/2307.03172; the reranker as a way of having high recall in the first stage and high precision in what reaches the model is in D2.

---

## D5. Curate what enters the index before growing it

**What it requires.** The indexed set is chosen explicitly. Adding an entire knowledge base "in case it helps" is a quality decision, not a completeness one, and it needs evidence that it improves more than it dirties.

**When it applies.** The diff connects a new source to retrieval (a full knowledge base, all of a client's documents, the entire history) with no filter and no eval showing the effect.

**Why it bites.** Outdated documents, drafts and internal notes compete for the same top-k slots as the correct documents. Quality drops precisely on the questions that used to work, because now the relevant chunk fell below the cutoff. And the degradation is diffuse: no single query fails, all of them get slightly worse.

**Backing.** `evidence` — the conservative decision was explicitly requested: "para primera versión no sacaría nada del knowledge base" — PR #12360 (BE), `mercado-libre-answer-generation.service.ts` (Panda).

---

## D6. The index has to say the same thing as the source, and so does the job that updates it

**What it requires.** Every write path over the source has its counterpart that updates the index or the derived context. If there is a periodic sync, verify that it uses the same path as the hot write. This is the instance of C17 over derived data.

**When it applies.** The diff fixes context generation in one service and there is another — typically a nightly cron or consumer — that writes the same field by another path. Or a write to the source is added without invalidating or reindexing.

**Why it bites.** The fix works until the next night: the nightly job overwrites with the old version and the bug returns to production with no deploy associated. It is especially cruel because the PR that fixed it is already closed and the report arrives days later.

**Backing.** `evidence` — "**El sync nocturno de Reservo va a dejar schema y skill_context contradictorios en Waxkin prod.** Este fix quedó bien acá, pero `update-reservo-function.service.ts` (la queue del treatment sync nocturno) llama al mismo" service — PR #12808 (BE) (Panda). **Note:** it is derived-context synchronization, not a vector index, but it is exactly the same failure shape — two write paths over the same derived data and only one fixed.

---

## D7. What gets embedded is not the same as what gets shown

**What it requires.** The text that is vectorized is built on purpose — title, discriminating fields, no repeated boilerplate — and can differ from the text passed to the model or shown to the user. The diff makes clear which is which.

**When it applies.** The diff embeds the full serialized object, concatenates every available field, or embeds text that includes a header identical across all documents (legal terms, signature, email template).

**Why it bites.** Shared boilerplate dominates the vector: every document looks like every other and search stops discriminating. The symptom is that the same three rows come back for any query and, because it returns something, it reads as "retrieval works but the model does not understand", so time is wasted on the prompt.

**Backing.** `consensus`, aligned with the local criterion of curating what enters the context (D5).

---

## D8. Evaluate retrieval with real queries and assume failures you did not see at design time

**What it requires.** The test query set comes from the questions users actually ask — with typos, abbreviations, mixed language and missing context — not from well-formed queries written by whoever built the index. And validation does not end in staging: you need production instrumentation and an improvement loop.

**When it applies.** A search eval test or script whose queries are complete, correct sentences, when the real channel is chat. A plan that says "we validated the RAG in staging and called it good".

**Why it bites.** The author's queries are written with the index's vocabulary, so they retrieve well by construction (C7). The user writes "cuanto sale el de 500" and there is nothing in the index with those words: the eval stays green and the system fails on 100 % of real queries of that kind without the metric moving a point.

**Backing.** `source` — Barnett et al., *Seven Failure Points When Engineering a Retrieval Augmented Generation System*, arXiv:2401.05856 — https://arxiv.org/abs/2401.05856, an experience report over three real cases, with two hard conclusions: "1) validation of a RAG system is only feasible during operation, and 2) the robustness of a RAG system evolves rather than designed in at the start". **Honesty note:** the abstract does not enumerate the seven points; the abstract was read, not the body, so they are not listed here. Real input noise (typing, transcription) is measured in `NLP/text.md` TX6.

---

## D9. Embeddings are cached by content, not recomputed per request

**What it requires.** The embedding is computed once per content and stored with a key derived from the text and the model. A change that does not touch the text does not trigger recomputation.

**When it applies.** The diff calls the embeddings API inside a `map` over query results, inside a request handler, or in a sync job that reprocesses every row even though only one changed.

**Why it bites.** Aggregate latency on the hot path and, in the bulk sync, provider rate limiting that fails the whole job exactly when you are migrating. The silent version: the job recomputes everything every night and the index is inconsistent during the reprocessing window, so searches in that time slot return different results from the rest of the day.

**Backing.** `consensus`. The key must include the model identifier per C15.

---

## What changed: widely cited practices no longer recommended the same way

Preserved intact; this is the item that belongs to retrieval.

5. **The chunking defaults that circulate in tutorials have no measured backing.** The available systematic evaluation favors considerably smaller chunks (200 tokens, no overlap) than the usual 1000/200, by a precision difference of several multiples. *Source: Chroma, Evaluating Chunking Strategies for Retrieval — https://research.trychroma.com/evaluating-chunking.* See D3.

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- For several arXiv papers, the **abstract and metadata** were read, not the full body. Where a practice depends on a detail that only exists in the body, it is flagged in the entry itself (this happens in *Seven Failure Points*, D8).
- Some sources are **interested parties** in what they recommend: Chroma on chunking (D3) and Anthropic on contextual retrieval (D2). It is flagged in each case. The numbers they publish are not replicated by independent third parties.
- The *Lost in the Middle* finding (D4, and `prompts.md` A4) is from 2023 and models have changed a lot since: treat it as a hypothesis to verify with your own eval, not as law. The practical corollary (retrieve less and better instead of more) does remain valid and appears in 2024–2025 sources.
