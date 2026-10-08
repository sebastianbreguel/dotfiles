---
updated: 2026-08-16
ttl: 24 months
sources: 0
---

# Yuyo — ML Knowledge Index

**What this is.** One line per principle, keyed by the thing you can *see in the diff* that makes it apply. Read this file to decide which of the five ML files to open; do not cite from it — the backing lives in the leaf.

**What lives here vs. elsewhere.**

- **`ML/`** — anything that works on a feature matrix: model choice, features, tuning, artifacts, probabilities, metrics, splits, clustering.
- **`NLP/`** — text-specific technique: encoding and canonicalization (`NLP/text.md`), tokenization and segmentation (`NLP/tokenization.md`), embeddings, multilingual representation and topic modeling's text layer (`NLP/representations.md`), text search (`NLP/search.md`). Start at `NLP/INDEX.md`.
- **`LLM/`** — prompts, structured output, tool use and agents, RAG, LLM judges, cost/latency/security/observability. Start at `LLM/INDEX.md`.
- **`CORE.md`** — read in full on every review, before any of these.

**Tie-breaks between files.**

| Situation | Owner | Why |
|---|---|---|
| Near-duplicate **detection** on text (MinHash, shingles, normalization) | `NLP/text.md` | the technique is text-specific |
| Near-duplicate rows **landing on both sides of a split** | `ML/evaluation.md` | the consequence is modality-independent |
| UMAP / HDBSCAN / silhouette / seeds on *any* vectors | `ML/clustering.md` | works on any feature matrix |
| Topic coherence, c-TF-IDF, BERTopic's text layer | `NLP/representations.md` | text-specific evaluation |
| "Which model should this be" | `ML/selection.md` | criteria, not a catalog |
| "This model is too slow / can't be retrained" | `ML/selection.md` | cost is a selection axis, not an ops afterthought |
| A `.pkl` that won't load, or a lost training set | `ML/construction.md` | the artifact section |
| A number in `[0,1]` compared to a constant | `ML/calibration.md` | a threshold makes it a probability claim |
| The same number used only to sort | `ML/evaluation.md` | ranking needs no calibration |
| Tuning that touches the test set | `ML/construction.md` (how to tune) + `ML/evaluation.md` (the test set as budget) | read both |
| A metric argument under class imbalance | `ML/evaluation.md` | and read the AUPRC update, not only the 2015 result |

---

## selection.md — which algorithm for which problem

| Principle | Observable trigger |
|---|---|
| Start from a tree ensemble on tabular data | `torch.nn.Module` / Keras model fed by a `DataFrame` of typed columns, ≤ ~10k rows, no image/audio/free text input |
| Choose a linear model when the coefficient must be defensible | a SHAP/LIME call whose output is shown to an end user or operator as the reason for a decision; or n in the hundreds with more features than rows |
| Reach for an SVM when features outnumber rows | `SVC(kernel='rbf')` — check `X.shape`; also `SVC(probability=True)`, which adds a hidden 5-fold CV per fit |
| Pick the clustering algorithm by k-known and noise-allowed | `KMeans(n_clusters=8)` where the 8 has no derivation; or HDBSCAN feeding a consumer that cannot receive a `-1` bucket |
| Budget the retraining loop before picking the model | training entry point requiring a GPU or an hours-long search, in a repo that ships by rebuilding a container |
| Inference cost is a property of the algorithm | `model.predict` inside a request handler rather than a batch job |
| Record the criteria, not the model name | a PR adding an estimator + a metric, with no statement of what the alternative was or when to revisit |

## construction.md — features, tuning without leaking test, the artifact

| Principle | Observable trigger |
|---|---|
| Ship the heuristic first and keep it as the floor | a first ML PR reporting one number with nothing to compare it against |
| Build the pipeline end to end on the simple model | a diff that is 90% modelling and 10% integration for a system that has never served a prediction; a training script reading a local CSV |
| Prefer directly observed columns over model-produced features | `embed(text)`, `upstream_score`, `cluster_id` in the feature matrix |
| Fit every transform inside the split | `fit_transform` on full `X` on a line *above* `train_test_split` / `cross_val_score`; `SelectKBest`, `StandardScaler`, `SimpleImputer`, `PCA` outside a `Pipeline` |
| Target encoding leaks unless cross-fitted | `df.groupby(col)[target].mean()` merged back onto the training frame; `TargetEncoder.fit(...)` then `.transform(X_train)` |
| Log the features you actually served, and train on those | the same feature name computed in two files that share no code (warehouse SQL + serving lookup) |
| Tune in an inner loop, report from an outer loop | `grid.best_score_` printed as the model's performance; `GridSearchCV` fit on all data with no untouched holdout |
| Spend the tuning budget on random search | a `param_grid` with 4+ keys — multiply it out |
| Audit for leakage explicitly | a held-out metric that is *surprisingly* good; that instinct is the detector |
| The training dataset is part of the artifact | training reads a mutable table with no `AS OF` / date bound; a `.pkl` with no sibling record of the rows behind it |
| A pickled model is pinned to an environment | `joblib.load` / `pickle.load` in a serving path with a `>=` dependency range or a bot-driven upgrade |
| Never let a model-load failure degrade silently | `except Exception: return default_prediction` around a load or `predict`; a global filter suppressing `InconsistentVersionWarning` |

## calibration.md — `predict_proba` is not a probability

| Principle | Observable trigger |
|---|---|
| Boosted-tree and SVM scores are rankings, not probabilities | `predict_proba(...)[:,1]` from a boosted/max-margin/forest model compared to a literal, stored in a `probability` column, multiplied by money, or shown as a percentage |
| Calibrate when the score becomes a decided threshold | a constant compared against a score (`if score > 0.85`); expected-value arithmetic; two models' scores compared to each other. **Not** needed when the score is only ever sorted |
| Fit the calibrator on data the model never saw | `CalibratedClassifierCV(FrozenEstimator(clf))` where `clf` was fit on the same `X`; a hand-rolled fit on `clf.predict_proba(X_train)` |
| Platt vs isotonic by calibration-set size | any `method=` choice — count rows *per fold*, not total. Under ~1000: sigmoid. 1000+: isotonic |
| Read the reliability diagram, not a Brier/ECE scalar | "Brier improved from 0.14 to 0.12" or "ECE 0.03" offered as proof, with no plot and no bin counts |
| Resampling or class weights shift the output probabilities | `SMOTE` / `RandomUnderSampler` / `class_weight='balanced'` **plus** a consumed `predict_proba` value |
| Modern networks are overconfident; temperature-scale them | `softmax(logits)` used as a confidence gate ("auto-resolve when > 0.95") |

## evaluation.md — metrics per task, imbalance, splits by group

| Principle | Observable trigger |
|---|---|
| Report macro-F1 and micro-F1 together | one F1 figure with no averaging stated; accuracy on an imbalanced problem |
| Under imbalance, look at the PR curve, not ROC | positive prevalence < ~10% with ROC-AUC > 0.9 |
| Do not treat AUPRC as automatically superior | a switch to average precision justified by imbalance alone, on a model serving subgroups with different prevalence. **Read this together with the previous line** |
| Consider MCC for binary classification | only positive-class F1 reported where "no action required" has real cost |
| Pick the metric from the decision, then tune the threshold | `model.predict(X)` (hardcoded 0.5) feeding an action; a threshold constant with no derivation; only threshold-free metrics reported for a single-threshold deployment |
| Check whether the classifier needs SMOTE at all | `imblearn` in `requirements.txt` with no experiment attached |
| Deduplicate near-identical rows before splitting | templated tickets, forwarded messages, re-imported records, retried webhooks going into `train_test_split` unfiltered. **Text detection lives in `NLP/text.md`; the split rule lives here** |
| Split by group, not by row | `train_test_split(..., random_state=42)` where rows are messages and few users/annotators generate many; test metric ≫ production |
| Split by time when rows are ordered in time | a shuffled split over a table with `created_at`, especially with lookback-window aggregate features |
| A fixed split is not statistical evidence | "deploy B, it has +0.3 F1 on a 500-row test set" |
| The test set is a budget; every look spends some | a fixed `test.csv` referenced from both the evaluation script and the tuning notebook, across many PRs |

## clustering.md — UMAP, HDBSCAN, seeds, DBCV/silhouette, PCA/t-SNE, representatives

| Principle | Observable trigger |
|---|---|
| UMAP-before-HDBSCAN works, and the docs call it controversial | HDBSCAN on 768/1536-dim embeddings returns mostly noise and UMAP gets inserted with no validation |
| Do not read distances or sizes off the 2D scatter | "cluster A is far from B so they're different" with a UMAP/t-SNE scatter as the only evidence |
| Initialize the projection informatively | `TSNE(...)` with default/`init='random'`; a migration to UMAP justified by "better global structure" or "more stable across runs" |
| PCA for reductions you keep; t-SNE/UMAP only to look | a UMAP/t-SNE embedding written to a column, used as a model input, or recomputed per request; `TSNE` dominating job runtime |
| HDBSCAN noise is a design output, tuned via `min_samples` | 70% of rows labelled `-1` and the reflex is to change algorithm |
| Fix the seed, or two runs are not comparable | cluster count "changed" between runs; an A/B config comparison with no `random_state` |
| Silhouette is not neutral between algorithm families | "we use k-means because it has a better silhouette" |
| Score density clusterings with DBCV, not silhouette | `silhouette_score(X, hdbscan_labels)` — note it treats `-1` as a real cluster |
| Report stability before reporting the number of clusters | a headline cluster count from one run; an elbow or silhouette-vs-k plot presented as the derivation of k |
| Name how the representative is chosen; prefer a real record | `cluster_centers_` fed to a decoder, a nearest-neighbour lookup, or a prompt; "one example per cluster" shown to a user or an LLM |

---

## Reading order

1. `CORE.md` (always, in full).
2. This index — pick the leaves whose trigger you can actually see in the diff.
3. The leaves. Two leaves frequently pair: `construction.md` + `evaluation.md` on any split or tuning question; `calibration.md` + `evaluation.md` on any threshold; `selection.md` + `clustering.md` on any "which clustering algorithm".

## Counts

47 principles across five leaves: selection 7, construction 12, calibration 7, evaluation 11, clustering 10. Twelve are migrated from the former flat NLP.md, now split into `NLP/` (seven in `evaluation.md`, five in `clustering.md`) with URLs and backing levels preserved; thirty-five are new research. `sources: 0` in this file's header is correct — the index cites nothing; every URL lives in a leaf.
