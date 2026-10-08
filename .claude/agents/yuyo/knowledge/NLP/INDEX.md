---
updated: 2026-08-16
ttl: 24 months
sources: 0
---

# Yuyo — NLP specialty index

Read `CORE.md` in full first. Then load only the leaves whose trigger is in the changed lines. Every leaf is self-contained; nothing here is a summary of the leaves.

| Leaf | Load it when the diff shows | Count |
|---|---|---|
| `text.md` | text cleanup or normalization, a dedup key, character-based truncation, a language router, an annotation pipeline, or a metric over generated text | 13 (TX1–TX13) |
| `tokenization.md` | a tokenizer, a `split()` over text, a word count, a token estimate, a sentence-based chunker, or a character limit derived from a context window | 6 (TK1–TK6) |
| `representations.md` | a vectorizer, an embeddings call, a vector index configuration, a similarity threshold, the choice of a representation model per language, or a topic model's keywords/coherence | 12 (RP1–RP12) |
| `search.md` | a search query, an FTS configuration, an `ILIKE '%…%'`, a ranking fusion, a reranker, or a plan to swap search for embeddings | 6 (SR1–SR6) |

## Tie-breaks

- **Normalizing text is both `text.md` and `search.md`.** If the normalization changes what is *stored or compared* (NFC, mojibake repair, dedup keys), go to `text.md`. If it exists so that *search matches* (unaccent, trigram, FTS configuration), go to `search.md` — and `text.md` TX5 is the one that says it must not be done destructively on the data column.
- **Cutting text is both `text.md` and `tokenization.md`.** Cutting to a character or display length is `text.md` TX3 (grapheme clusters). Cutting to fit a model or estimating how much fits is `tokenization.md` TK4, and the budget decision is `LLM/operations.md` G9.
- **A similarity threshold** → the vector side (calibration, cosine, L2) is `representations.md` RP5/RP6; the core rule that every threshold is calibrated is C4.
- **Embeddings** → choosing and mixing models is `representations.md`; how they are used to build context for a generative model is `LLM/retrieval.md`.
- **Multilingual** → identifying the language of an incoming text and reporting per language is `text.md` TX8/TX9; choosing the representation model per language is `representations.md` RP8–RP10; per-language token cost is `tokenization.md` TK4.
- **Near-duplicates** → detecting them in the text is `text.md` TX7. The consequence for train/test splits lives in `ML/evaluation.md`.
- **Topic modeling** → the text layer (c-TF-IDF keywords, topic coherence) is `representations.md` RP11/RP12. The machinery underneath (UMAP, HDBSCAN, seeds, DBCV/silhouette, representatives) is `ML/clustering.md`.

## What is deliberately not here

Classification and splits, and clustering, are under `ML/`: `GroupKFold`, SMOTE, macro/micro F1, PR-AUC, UMAP, HDBSCAN, DBCV and silhouette work on any feature matrix and know nothing about language. One of the "practices that changed" from the original NLP corpus travels with them (SMOTE as the reflex answer to imbalance), as does the source-verification note about the scikit-learn silhouette bullet.

## Note on maturity

Engineering NLP that does not depend on generative models is a mature field: almost everything worth doing already has a paper or official documentation behind it, and has for years. The gap is not in the recommendation but in the adoption. The cases where the practice is published and almost nobody executes it: measuring tokenizer fertility per language (`tokenization.md` TK4), computing statistical power before labeling (`text.md` TX11), and adding CheckList-style behavioral tests (`text.md` TX12). That is the map of where cheap marginal value is.
