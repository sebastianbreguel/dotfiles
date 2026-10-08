---
updated: 2026-08-16
ttl: 24 months
sources: 14
---

# Yuyo — NLP / Representations

**What it covers.** How text becomes vectors and what those vectors are worth: TF-IDF plus a linear model as the baseline, stopword lists, sentence embeddings versus raw encoders, choosing an embedding model by task, L2 normalization and metric direction, cosine threshold calibration, one index one model, the multilingual dimension of the same decisions (multilingual versus monolingual model, cross-lingual transfer, aligned multilingual embeddings), and the text layer of topic modeling (c-TF-IDF and topic coherence).

**When to read it.** When the diff touches a vectorizer, an embeddings call, a vector index configuration, a similarity threshold, the choice of a representation model for one or more languages, or a topic model's representation and coherence. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `RP<n>`. Cross-file references name the file (`NLP/search.md` SR1, `NLP/text.md` TX9, `LLM/retrieval.md` D9).

**Note on the distribution of backings in this specialty.** Almost everything here is `source` and almost nothing is `evidence`: the team has no record of asking for anything about embeddings or thresholds. That does not weaken the principles — they have a paper or official documentation behind them — but you explain the mechanism and cite the source rather than invoking precedent that does not exist.

---

## RP1. TF-IDF with a linear classifier is the baseline, and it goes in the report next to the model

**What it requires.** Before the first line of fine-tuning or the first call to an embeddings API, the TF-IDF plus linear number exists. And that number appears in the report's table, not only in the author's head.

**When it applies.** Any PR or notebook that reports a classification metric without the "TF-IDF + LogisticRegression" row. The concrete instance of C1 in text classification.

**Why it bites.** The cheap baseline is interpretable, trains in seconds and is often a small distance from far more expensive architectures. Without it, the complex model's number is not evidence: it may be tying, and all the operational complexity it drags along (serving, versioning, monitoring) is paid for nothing.

**Backing.** `source` — scikit-learn, *Tf–idf term weighting* — https://scikit-learn.org/stable/modules/feature_extraction.html (exact defaults `TfidfTransformer(norm='l2', use_idf=True, smooth_idf=True, sublinear_tf=False)` and the formula `idf(t) = log((1+n)/(1+df(t))) + 1`). Experimental evidence: Joulin et al., *Bag of Tricks for Efficient Text Classification*, arXiv:1607.01759 — https://arxiv.org/abs/1607.01759.

---

## RP2. Audit the stopword list before using it

**What it requires.** No stopword list is applied blindly. Concrete check: print the intersection between the list and the 200 terms with the highest mutual information with the label.

**When it applies.** A `stop_words='english'` in a `TfidfVectorizer`, or a Spanish list copied from a blog.

**Why it bites.** The lists shipped with libraries have surprising omissions and inclusions and are inconsistent across packages: one includes `hasn't` but not `hadn't`, another includes `computer`. Applying them erases terms that discriminate in the domain and the loss shows up as "the model does not separate those two classes well".

**Backing.** `source` — Nothman, Qin and Yurchak, *Stop Word Lists in Free Open-source Software Packages*, NLP-OSS 2018 — https://aclanthology.org/W18-2502/ (they investigate 52 English lists and document the problem with concrete examples). scikit-learn's own documentation carries the warning: "there are several known issues with our 'english' stop word list. It does not aim to be a general, 'one-size-fits-all' solution" and "please take care in choosing a stop word list. Popular stop word lists may include words that are highly informative to some tasks, such as *computer*" — https://scikit-learn.org/stable/modules/feature_extraction.html.
- `debated` about removing stopwords in general. *Position A:* for bag-of-words and lexical search it still reduces noise and index size. *Position B:* for contextual models it destroys syntactic information and contributes nothing. **Recommendation:** remove them only on the lexical path, never on the contextual one. Practice that **changed**: it stopped being a safe default.

---

## RP3. Do not use mean pooling over a raw BERT as a sentence embedding

**What it requires.** Search vectors come from a model trained for sentence embeddings, not from averaging the hidden states of an unfine-tuned encoder.

**When it applies.** Code that does `AutoModel.from_pretrained(...)` and averages `last_hidden_state` to build vectors.

**Why it bites.** Unfine-tuned BERT does not produce a sentence space where cosine means anything: averaging hidden states performs poorly and the correct pairwise comparison is computationally infeasible at scale. Search still returns results, so the failure reads as "the model does not understand the query".

**Backing.** `source` — Reimers and Gurevych, *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*, arXiv:1908.10084 — https://arxiv.org/abs/1908.10084.

---

## RP4. Choose the embedding model by the task, not by the ranking average

**What it requires.** The choice looks at the sub-task that corresponds to the use (retrieval if it is search, clustering if the goal is grouping, STS if it is similarity) and at the language, not at a leaderboard's average column.

**When it applies.** A PR that changes or chooses the embedding model citing its general position in a ranking.

**Why it bites.** There is no embedding method that dominates every task: a model that leads on semantic textual similarity does not necessarily lead on clustering or retrieval. Choosing by the average is choosing by tasks that are not yours.

**Backing.** `source` — Muennighoff, Tazi, Magne and Reimers, *MTEB: Massive Text Embedding Benchmark*, arXiv:2210.07316 — https://arxiv.org/abs/2210.07316: 8 tasks, 58 datasets, 112 languages and 33 models, with the verbatim conclusion that "no particular text embedding method dominates across all tasks", suggesting the field "has yet to converge on a universal method".

---

## RP5. L2-normalize and choose the metric knowingly

**What it requires.** The code makes explicit whether the metric is distance (smaller is better) or similarity (larger is better), and vectors are normalized to unit norm if the index was configured with a metric that assumes it. One-line check: `np.linalg.norm(vecs, axis=1)` should give ~1.0.

**When it applies.** A vector index configured with the Euclidean metric over unnormalized vectors. A change of embedding provider where the new one does not normalize by default. Strong signal: inverted comparators between two functions working on the same index.

**Why it bites.** With normalized vectors, cosine and dot product are the same thing and Euclidean ordering is equivalent to cosine ordering; without normalization they are not, and vector magnitude starts influencing the ranking without anyone having decided it. With the comparator inverted, the system returns exactly the least relevant results and keeps working without errors: it is only detected by reading results by hand.

**Backing.** `source` — Sentence Transformers, *Semantic Textual Similarity* — https://sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html: the metric is stored in `SentenceTransformer.similarity_fn_name` with options `COSINE` (default), `DOT_PRODUCT`, `EUCLIDEAN` (negative Euclidean distance) and `MANHATTAN`, and cosine is defined there as "the dot product between their normalizations". On the TF-IDF side, scikit-learn documents `norm='l2'` by default — https://scikit-learn.org/stable/modules/feature_extraction.html.

---

## RP6. Do not interpret the absolute value of a cosine; calibrate it against labeled pairs

**What it requires.** A similarity threshold comes from labeling a few hundred pairs, plotting the precision-recall curve over the score and choosing the point that respects the cost of each error. And the calibration is repeated every time the model changes. This is the concrete instrument of C4.

**When it applies.** A magic constant like `if score > 0.85` to decide "it is the same client" or "it is a duplicate". A threshold that survived an embedding model change.

**Why it bites.** "0.8 is similar" is not transferable across models, and there is an analytical derivation that cosine similarity over learned embeddings can produce arbitrary similarities depending on regularization. Besides, contextual representations are anisotropic: they occupy a narrow cone of the space, so two random vectors already have a high cosine and the "reasonable" threshold is measuring that geometry, not the domain.

**Backing.** `source + debated` — Steck, Ekanadham and Kallus, *Is Cosine-Similarity of Embeddings Really About Similarity?*, arXiv:2403.05440 — https://arxiv.org/abs/2403.05440. Anisotropy: Ethayarajh, *How Contextual are Contextualized Word Representations?*, EMNLP-IJCNLP 2019, pp. 55–65 — https://aclanthology.org/D19-1006/.
- *Position A (Steck et al.):* cosine has no guaranteed semantics; it is better to avoid depending on its value and to train or evaluate directly for the objective.
- *Position B (dominant practice):* in models trained with a contrastive objective for sentence similarity, cosine works well empirically, and it is enough to calibrate the threshold with your own data.
- **Recommendation:** position B with position A's discipline — use cosine, but never its absolute value without calibration, and recalibrate on every model change. **Tradeoff:** a few hundred labeled pairs of work, once per model.
- Practice that **changed**: the cosine threshold stopped being a universal number.

---

## RP7. Never mix vectors produced by different models in the same index

**What it requires.** One index, one model, one version. Changing the model forces re-embedding the entire history. This is the concrete instrument of C15.

**When it applies.** A migration that changes the embedding model name without a backfill of the vector table. A write path into the index that uses a different model from the initial load.

**Why it bites.** Two independently trained models do not share a vector space even if they have the same dimensionality. It is a silent bug: search keeps returning results, they are just bad, and for queries whose neighborhood crosses the two populations the ordering is arbitrary.

**Backing.** `source` — Reimers and Gurevych, *Making Monolingual Sentence Embeddings Multilingual using Knowledge Distillation*, arXiv:2004.09813 — https://arxiv.org/abs/2004.09813: the premise of the method is that a teacher has to be distilled into a student for both vectors to land in the same space; if the spaces were already compatible, the method would be unnecessary.

---

## RP8. A large multilingual model helps in low resource, but there is capacity dilution

**What it requires.** The monolingual versus multilingual decision is made with a per-language experiment, not out of operational convenience.

**When it applies.** The product operates in two or three languages with very unequal volume and a single model is chosen without measuring per language.

**Why it bites.** At fixed capacity, adding languages ends up degrading per-language performance: the dominant language pays for covering the tail. If 85 % of traffic is the big language, that degradation is the one that touches the most customers and the one least visible in the average.

**Backing.** `source + debated` — Conneau et al., *Unsupervised Cross-lingual Representation Learning at Scale* (XLM-R), arXiv:1911.02116 — https://arxiv.org/abs/1911.02116: they analyze "the trade-offs between (1) positive transfer and capacity dilution and (2) the performance of high and low resource languages at scale", with +14.6 % average accuracy on XNLI over mBERT (+15.7 % on Swahili, +11.4 % on Urdu over previous XLM models).
- *Position A:* a single multilingual model simplifies operations and is clearly better for languages with little data. *Position B:* for a language with abundant data, a monolingual model of the same size performs better. **Recommendation:** the deciding experiment is to train monolingual for the dominant language and multilingual for the tail, and compare per language. **Tradeoff:** two artifacts to operate versus one point of quality in the language that bills the most.

---

## RP9. Cross-lingual transfer exists, but it decays with the distance between languages

**What it requires.** "We train in English and it works in every language" is measured before being assumed, and the expectation is adjusted by typological similarity and shared script.

**When it applies.** A multilingual rollout plan based on a model trained in a single language.

**Why it bites.** Transfer is surprisingly effective but not uniform. For Spanish and Portuguese the bet is reasonable; for Japanese or Arabic it has to be measured, and the team usually finds out after having promised the date.

**Backing.** `source` — Pires, Schlinger and Garrette, *How Multilingual is Multilingual BERT?*, ACL 2019 — https://aclanthology.org/P19-1493/.

---

## RP10. For multilingual embeddings to be comparable with each other, they have to be aligned explicitly

**What it requires.** For a query in one language to find a document in another within the same index you need a model trained for that; it is not enough for the model to "support" both languages.

**When it applies.** A multilingual vector index built with a model chosen because its model card mentions both languages.

**Why it bites.** Two sentences in different languages landing close in the vector space does not happen by chance: it requires training with that objective. Without alignment, cross-lingual search returns plausible and wrong results, which is the worst kind of search failure.

**Backing.** `source` — Reimers and Gurevych, *Making Monolingual Sentence Embeddings Multilingual using Knowledge Distillation*, arXiv:2004.09813 — https://arxiv.org/abs/2004.09813.

---

## RP11. Automatic topic coherence is not validated for neural models

**What it requires.** Choosing the number of topics and comparing across model families does not rest on NPMI or C_v alone: it is complemented with human review of a sample of topics and of representative documents.

**When it applies.** The selection criterion for the number of topics is maximizing automatic coherence.

**Why it bites.** Those metrics were developed and validated for classical models and were not validated with human experimentation for neural ones. Optimizing against an unvalidated metric produces configurations that score well and that nobody recognizes when reading the topics.

**Backing.** `source + debated` — Hoyle et al., *Is Automated Topic Model Evaluation Broken?: The Incoherence of Coherence*, arXiv:2107.02173 — https://arxiv.org/abs/2107.02173: "topic model evaluation suffers from a validation gap: automated coherence, developed for classical models, has not been validated using human experimentation for neural models".
- *Position A:* without human validation, automatic coherence does not support "my neural model is better". *Position B:* it is still a cheap, useful proxy for comparing configurations of the *same* model. **Recommendation:** use it within a family, never across families, and always with a hand-reviewed sample. Practice that **changed**: reporting only NPMI/C_v is no longer enough.

---

## RP12. BERTopic: the contribution is c-TF-IDF over the clusters, not the clustering itself

**What it requires.** Treat BERTopic as three interchangeable components (embeddings, reduction, clustering) plus a class-based representation extraction, and isolate the problem by changing one at a time.

**When it applies.** The pipeline uses BERTopic as a black box, the topics are bad, and nobody knows whether the problem is in the embedding, in the reduction or in the keyword extraction.

**Why it bites.** Without understanding the separation, iteration is blind: the embedding model gets swapped to fix a problem that was in `min_cluster_size`, and because the whole pipeline is stochastic every attempt appears to move something.

**Backing.** `source` — Grootendorst, *BERTopic: Neural topic modeling with a class-based TF-IDF procedure*, arXiv:2203.05794 — https://arxiv.org/abs/2203.05794. Documentation: https://maartengr.github.io/BERTopic/faq.html. The clustering and dimensionality-reduction components themselves (UMAP, HDBSCAN, seeds, internal indices) are in `ML/clustering.md`.

---

## Practices marked as "changed"

These are the most valuable ones because they contradict what is still taught. Preserved intact; these are the items that belong to representations.

4. **Automatic topic coherence lost its backing** for neural models: it was never validated with humans in that regime (Hoyle et al., 2021 — arXiv:2107.02173). See RP11.
5. **Removing stopwords stopped being a safe default** — the lists shipped with libraries have documented problematic inclusions and omissions (Nothman et al., 2018 — https://aclanthology.org/W18-2502/). See RP2.
6. **The cosine threshold is not a universal number** — there is an analytical derivation that cosine similarity can be arbitrary depending on the model's regularization (Steck et al., 2024 — arXiv:2403.05440). See RP6.

---

**Consultation date for this file's sources:** August 15, 2026. Library defaults correspond to the versions cited and must be verified against the version in use.
