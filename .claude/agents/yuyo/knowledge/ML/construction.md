---
updated: 2026-08-16
ttl: 24 months
sources: 11
---

# Yuyo — ML: Building the Model

**What this covers.** The path from "we decided to use model family X" to "there is an artifact in production we can rebuild": baselines, features, tuning without spending the test set, and the artifact itself — including the failure where a model becomes unrunnable *and* unrebuildable at the same time. Out of scope: which family to pick (`selection.md`), turning scores into probabilities (`calibration.md`), and metric/split design (`evaluation.md`).

**Backing scale.** Identical to the core file. A principle may carry two levels.

- **`source`** — official documentation, paper, or standard cited with a URL.
- **`evidence`** — a senior reviewer asked for it in a real PR of this repository, with a verbatim quote.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both are named and one is recommended with its tradeoff.

---

## 1. Baseline before complexity

### Ship the heuristic first and keep it as the floor the model must clear

**What it requires.** Before the first model, there is a rule — most-recent, most-frequent, a threshold on one column — measured on the same data with the same metric. That number goes in the PR next to the model's number and stays in the repository as a comparison, not as a deleted scratch cell.

**When it applies.** A first ML PR for a problem the codebase currently solves with an `if` chain, a `ORDER BY created_at DESC`, or nothing at all. Observable absence: a PR that reports one number, from one model, with nothing to compare it to.

**Why it bites.** Without the floor, nobody can tell whether the model is contributing. A classifier at 0.82 F1 sounds like work well done until someone computes that "always predict the majority class" gets 0.79 — at which point the whole pipeline, its retraining job, and its serving path are carrying three points of metric. The discovery usually happens during a cost review, months in, and the honest answer is that the model should never have shipped.

**Backing.** `source` — Zinkevich, *Rules of Machine Learning: Best Practices for ML Engineering*, Google — https://developers.google.com/machine-learning/guides/rules-of-ml. Rule #1: "Machine learning is cool, but it requires data. Theoretically, you can take data from a different problem and then tweak the model for a new product, but this will likely underperform basic heuristics. If you think that machine learning will give you a 100% boost, then a heuristic will get you 50% of the way there." Rule #4: "The first model provides the biggest boost to your product, so it doesn't need to be fancy... Your simple model provides you with baseline metrics and a baseline behavior that you can use to test more complex models."

---

### Build the pipeline end to end on the simple model before improving the model

**What it requires.** The first thing that reaches production is the plumbing — data in, features computed the same way in training and serving, artifact out, prediction consumed — carrying a deliberately boring model. Model quality work starts after that path is green.

**When it applies.** A PR whose diff is 90% modelling (architecture, feature crosses, tuning) and 10% integration, for a system that has never served a prediction. Or: a training script that reads a CSV from someone's machine.

**Why it bites.** The infrastructure problems are the ones you did not budget for, and they surface last, when the model is already "done" and someone is waiting on it. Worse, they surface as *quality* problems — a feature that is populated at training time and null at serving time looks like a bad model, and the team spends a week tuning a model whose real defect is a join.

**Backing.** `source` — Zinkevich, Rules of ML, Rule #4 and Rule #5 — https://developers.google.com/machine-learning/guides/rules-of-ml. Rule #5: "Test the infrastructure independently from the machine learning... Test getting data into the algorithm. Check that feature columns that should be populated are populated... Make sure that the model in your training environment gives the same score as the model in your serving environment."

---

## 2. Features

### Prefer directly observed columns over features produced by another model

**What it requires.** The first feature set is made of things the system already records. A feature that is itself the output of another model — an embedding, a cluster id, a score from an upstream service — is added later, deliberately, with its own version pinned and its refresh behaviour understood.

**When it applies.** A feature matrix built by calling another model or service: `embed(text)`, `upstream_score`, `cluster_id` from a clustering that runs on its own schedule.

**Why it bites.** The upstream model has its own objective, its own release cadence, and no obligation to keep its output space stable. Three failure shapes, all of which look like your model degrading: the upstream system is retrained and the meaning of the feature shifts under you; you froze a snapshot and it silently goes stale; or the upstream is optimizing something only weakly related to your target and injects its bias into yours. None of these produce an error — they produce a slow metric decline with no diff to blame.

**Backing.** `source` — Zinkevich, Rules of ML, Rule #17 — https://developers.google.com/machine-learning/guides/rules-of-ml: "Start with directly observed and reported features as opposed to learned features... If you use an external system to create a feature, remember that the external system has its own objective. The external system's objective may be only weakly correlated with your current objective. If you grab a snapshot of the external system, then it can become out of date. If you update the features from the external system, then the meanings may change." Mechanism for why this is expensive to unwind: Sculley et al., *Hidden Technical Debt in Machine Learning Systems*, NeurIPS 2015 — https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html, which names "data dependencies" and "undeclared consumers" as primary risk factors.

---

### Fit every transform inside the split, never before it

**What it requires.** Scaling, imputation, feature selection, dimensionality reduction, and categorical encoding are fitted on training rows only and applied to the rest. Mechanically: put them in a `Pipeline` and pass the pipeline to the cross-validator, rather than transforming `X` and then splitting it.

**When it applies.** Observable, and it is one of the highest-yield things to grep for: a `fit_transform` on the full `X` on a line *above* the `train_test_split` or the `cross_val_score`. Same for `SelectKBest`, `StandardScaler`, `SimpleImputer`, `PCA`, and any target-based encoder.

**Why it bites.** The transform saw the test rows, so the reported score is measuring a model that had a peek. The size of the lie is not small: scikit-learn's own worked example selects features from 10,000 pure-noise columns using all the data and produces a confidently good score on data with no signal whatsoever. In production the model meets rows the transform never saw and the metric collapses, with no code change to point at.

**Backing.** `source` — scikit-learn, *Common pitfalls and recommended practices*, "Data leakage" — https://scikit-learn.org/stable/common_pitfalls.html: "Always split the data into train and test subsets first, particularly before any preprocessing steps. Never include test data when using the `fit` and `fit_transform` methods. Using all the data, e.g., `fit(X)`, can result in overly optimistic scores... The scikit-learn pipeline is a great way to prevent data leakage as it ensures that the appropriate method is performed on the correct data subset." The page notes the risk "is however relevant with almost all transformations in scikit-learn, including (but not limited to) `StandardScaler`, `SimpleImputer`, and `PCA`".

---

### Target encoding leaks unless it is cross-fitted, and the library will not warn you

**What it requires.** Any encoding that uses `y` to build a feature — target/mean encoding of a high-cardinality categorical — must compute each row's encoding from folds that exclude that row. In scikit-learn that means calling `fit_transform(X_train, y_train)` on `TargetEncoder`, never `fit(...)` followed by `transform(X_train)`.

**When it applies.** A high-cardinality categorical column (customer id, sku, phone prefix) turned into a number by grouping on the label. Observable: any hand-rolled `df.groupby(col)[target].mean()` merged back onto the training frame.

**Why it bites.** For a category that appears twice, the "mean target" of that category is essentially the row's own label. The model learns to read the answer off the feature; training accuracy goes near-perfect, held-out accuracy does not move, and the feature ranks first in every importance plot — which is the tell. The hand-rolled version is the dangerous one, because the library version silently does the right thing and teaches people the wrong lesson about what mean-encoding costs.

**Backing.** `source` — scikit-learn, *Preprocessing data*, Target Encoder — https://scikit-learn.org/stable/modules/preprocessing.html: "`fit_transform` internally relies on a cross fitting scheme to prevent target information from leaking into the train-time representation, especially for non-informative high-cardinality categorical variables... the training data is split into *k* folds (determined by the `cv` parameter) and each fold is encoded using the encodings learnt using the *other k-1* folds. For this reason, training data should always be trained and transformed with `fit_transform(X_train, y_train)`."

---

### Log the features you actually served, and train on those

**What it requires.** The features used at prediction time are written to a log at prediction time, and the training set is built from that log — or, at minimum, a sampled fraction is, so the two can be compared.

**When it applies.** Two code paths compute "the same" feature: one in a batch training job (SQL over the warehouse) and one in the serving path (a service call, a Redis lookup). Observable: the feature name appears in two files that share no code.

**Why it bites.** The two implementations drift — a different null default, a different time window, a timezone, a join that dedupes on one side only. Training-serving skew does not raise; it degrades. The model was fitted on a feature that means one thing and is served a feature that means something slightly different, and the only symptom is that production quality is worse than the offline number by an amount nobody can explain.

**Backing.** `source` — Zinkevich, Rules of ML, Rule #29 — https://developers.google.com/machine-learning/guides/rules-of-ml: "The best way to make sure that you train like you serve is to save the set of features used at serving time, and then pipe those features to a log to use them at training time. Even if you can't do this for every example, do it for a small fraction, such that you can verify the consistency between serving and training... Teams that have made this measurement at Google were sometimes surprised by the results."

---

## 3. Tuning without spending the test set

### Tune in an inner loop and report from an outer loop

**What it requires.** When hyperparameters are chosen by cross-validation, the number you report is not the best score that search found. Either hold out a test set that the search never touched, or wrap the search in an outer cross-validation (`cross_val_score(GridSearchCV(...))`) and report the outer scores.

**When it applies.** Highly observable: `grid.best_score_` printed as the model's performance. Or `GridSearchCV` fitted on all the data with no untouched holdout anywhere in the script.

**Why it bites.** The search maximized a noisy estimate over many candidates, so the winner's score contains the noise that made it win. That is a selection bias, not just variance, and it does not average out. The reported number is optimistic by an amount that grows with how many candidates you tried and shrinks with dataset size — so the more thorough your search looks, the more inflated your headline is. The correction is found in production.

**Backing.** `source` — Cawley and Talbot, *On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation*, JMLR 11 (2010) — https://www.jmlr.org/papers/v11/cawley10a.html: "the degradation in performance due to over-fitting the model selection criterion can be surprisingly large... we show that the effects of this form of over-fitting are often of comparable magnitude to differences in performance between learning algorithms, and thus cannot be ignored in empirical evaluation. Furthermore, we show that some common performance evaluation practices are susceptible to a form of selection bias as a result of this form of over-fitting and hence are unreliable." Mechanics and a worked size estimate: scikit-learn, *Nested versus non-nested cross-validation* — https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html: "Model selection without nested CV uses the same data to tune model parameters and evaluate model performance. Information may thus 'leak' into the model and overfit the data... Choosing the parameters that maximize non-nested CV biases the model to the dataset, yielding an overly-optimistic score." The example reports an "Average difference of 0.007581 with std. dev. of 0.007833" on iris — small there, and the page notes the magnitude "is primarily dependent on the size of the dataset and the stability of the model".

---

### Spend the tuning budget on random search, not on a grid

**What it requires.** With more than two or three hyperparameters, the search is random (or sequential/Bayesian) over ranges, with a fixed budget of trials — not a Cartesian product of hand-picked values.

**When it applies.** A `GridSearchCV` whose `param_grid` has four or more keys. Count the product: it is usually in the hundreds and each cell is a full cross-validated fit.

**Why it bites.** In a grid, every trial re-tests the same handful of values on every axis, so a grid of 5×5×5×5 explores only five distinct values of the one hyperparameter that actually matters, at the cost of 625 fits. Which hyperparameter matters is not knowable in advance and differs per dataset. The practical outcome is a search that costs a night, explores less than it looks like, and gets cancelled the next time because "tuning is too slow".

**Backing.** `source` — Bergstra and Bengio, *Random Search for Hyper-Parameter Optimization*, JMLR 13 (2012) — https://www.jmlr.org/papers/v13/bergstra12a.html: "randomly chosen trials are more efficient for hyper-parameter optimization than trials on a grid... random search over the same domain is able to find models that are as good or better within a small fraction of the computation time." The reason: "for most data sets only a few of the hyper-parameters really matter, but that different hyper-parameters are important on different data sets. This phenomenon makes grid search a poor choice for configuring algorithms for new data sets."

---

### Audit for leakage explicitly; it is the default outcome, not the exception

**What it requires.** Before a result is believed, someone walks the feature list asking "could this column have been written after the label was known?" and walks the split asking "could a row's near-twin be on the other side?". The answers go in the PR.

**When it applies.** Any model whose held-out metric is surprisingly good. That is the trigger — the reviewer's instinct that a number is *too* good is the cheapest leakage detector available, and it should be acted on, not congratulated.

**Why it bites.** Leakage produces a working demo and a broken product, and it survives review because everything about it looks correct: the split is there, the pipeline is there, the metric is high. The published record shows this is not a rare individual mistake but a systematic one across entire fields.

**Backing.** `source` — Kapoor and Narayanan, *Leakage and the Reproducibility Crisis in ML-based Science*, arXiv:2207.07048 (submitted 14 July 2022) — https://arxiv.org/abs/2207.07048: "We show that data leakage is indeed a widespread problem and has led to severe reproducibility failures. Specifically, through a survey of literature in research communities that adopted ML methods, we find 17 fields where errors have been found, collectively affecting 329 papers and in some cases leading to wildly overoptimistic conclusions. Based on our survey, we present a fine-grained taxonomy of 8 types of leakage that range from textbook errors to open research problems." The split-side half of this audit is owned by `evaluation.md` (grouped splits, near-duplicate rows, temporal ordering).

---

## 4. The artifact

### The training dataset is part of the artifact, not a disposable input

**What it requires.** Whatever produced the model is versioned and retrievable: an immutable snapshot of the exact rows, or a query plus the timestamp/watermark that makes it reproducible against an append-only source. The snapshot is referenced from the artifact — same commit, same manifest — so "which data made this model" has one answer, not a reconstruction.

**When it applies.** Two observable triggers. First: a training script whose data source is a mutable table read with `SELECT * FROM ...` and no `AS OF` / date bound. Second, worse: a `.pkl` or `.joblib` checked into the repository or dropped in a bucket, with no sibling artifact describing the rows behind it.

**Why it bites.** This is the failure that makes the next one terminal. On its own, a lost dataset is an inconvenience. Combined with an artifact that stops loading, it is a dead model: you cannot run the old one and you cannot produce a new one. And a "reproducible query" against a mutable table is not reproducible — rows were updated, soft-deleted, backfilled. Rerunning it a year later gives a different model, so you cannot even tell whether the new one is a regression.

**Backing.** `source` — scikit-learn, *Model persistence* — https://scikit-learn.org/stable/model_persistence.html states the requirement directly: "when training a model, it is important to record the training recipe (e.g. a Python script) and training set information, and metadata about all the dependencies to be able to automatically reconstruct the same training environment for the updated software." The documentation-of-datasets practice is Gebru et al., *Datasheets for Datasets*, arXiv:1803.09010 — https://arxiv.org/abs/1803.09010: "we propose that every dataset be accompanied with a datasheet that documents its motivation, composition, collection process, recommended uses, and so on." The model-side counterpart, for when the artifact is callable by a team other than the author's, is Mitchell et al., *Model Cards for Model Reporting*, FAT* 2019 — https://arxiv.org/abs/1810.03993, which asks a released model to carry its intended use context and the conditions under which its reported evaluation holds — so that a model measured on one population is not silently pointed at another.

---

### A pickled model is pinned to an environment; treat a version bump as a model change

**What it requires.** A serialized estimator ships with the exact versions that produced it (a lockfile, not a range), and the dependency-update process treats a bump of that library as a change that requires re-training and re-validating the model, not as a routine patch.

**When it applies.** `joblib.load(...)` or `pickle.load(...)` of an estimator in a serving path, in a repository where the dependency is specified as `scikit-learn>=1.x` or is upgraded by an automated bot. Also observable: a `try/except` around the load that falls back to a default prediction.

**Why it bites.** This is the concrete incident. Loading a model saved by a different library version is not supported: it may raise, or it may load into an object whose internals no longer mean the same thing. When the load is wrapped in a broad `except` — which it usually is, because someone added it to stop the service crashing — the model silently stops being used and the fallback path serves every request. Nothing alerts, because from the outside the endpoint returns 200s with plausible values. Discovery comes weeks later from a product metric, at which point the fix is "retrain" — and if the dataset is gone (previous principle) there is no fix at all.

**Backing.** `source` — scikit-learn, *Model persistence*, "Security & Maintainability Limitations" — https://scikit-learn.org/stable/model_persistence.html: "there are no supported ways to load a model trained with a different version of scikit-learn. While using `skops.io`, `joblib`, `pickle`, or cloudpickle, models saved using one version of scikit-learn might load in other versions, however, this is entirely unsupported and inadvisable." And: "If the versions of the dependencies used may differ from training to production, it may result in unexpected behaviour and errors while using the trained model. To prevent such situations it is recommended to use the same dependencies and versions in both the training and production environment. These transitive dependencies can be pinned with the help of package management tools like `pip`, `mamba`, `conda`, `poetry`, `conda-lock`, `pixi`, etc. It is not always possible to load a model trained with older versions of the scikit-learn library and its dependencies in an updated software environment. Instead, you might need to retrain the model with the new versions of all the libraries." The library emits `InconsistentVersionWarning` for the mismatch — a warning, which by default does not fail anything.

---

### Never let a model-load failure degrade silently

**What it requires.** The load path fails loud: an exception at startup, a health check that fails, or a metric that goes to zero and is alerted on. If a fallback exists, using it must be an alert, not a default.

**When it applies.** `except Exception: return default_prediction` around a model load or a `predict` call. Also: a warning filter that suppresses `InconsistentVersionWarning` or `sklearn.exceptions` globally.

**Why it bites.** A silent fallback converts a loud, five-minute incident into an invisible, six-week one. The system keeps answering, so no page fires; the answers are just no longer the model's. Every hour spent in that state is data you will later have to exclude from evaluation, because your logged "model predictions" are a mix of two different predictors with no flag distinguishing them.

**Backing.** `consensus` — this follows directly from the scikit-learn persistence documentation (the mismatch surfaces only as a warning: https://scikit-learn.org/stable/model_persistence.html) and from Sculley et al.'s "undeclared consumers" and system-level anti-patterns (https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), but the specific rule — fallbacks must alert — is an operational convention, not a cited finding.

---

## What changed

1. **"Reproducible" stopped meaning "the training script is in git".** Current guidance from the tooling itself is that the recipe, the *training set information*, and the dependency metadata must all be recorded, because the environment alone determines whether the artifact still loads (scikit-learn, *Model persistence* — https://scikit-learn.org/stable/model_persistence.html).
2. **Grid search is no longer the default tuning strategy it was taught as.** The 2012 result — that random trials beat grid trials at equal budget because only a few hyperparameters matter and which ones differ per dataset — is old enough to be uncontroversial and still not universally applied (Bergstra and Bengio — https://www.jmlr.org/papers/v13/bergstra12a.html).
3. **Leakage moved from "a mistake careless people make" to "a measured, field-wide failure mode".** The 2022 survey found 329 affected papers across 17 fields, which reframes leakage auditing from optional hygiene to a required review step (Kapoor and Narayanan — https://arxiv.org/abs/2207.07048).

---

## Sources I could not open or verify

1. **The ML Test Score rubric** (Breck et al., Google, 2017) was not retrieved for this file, so no claim here is attributed to it. Where an operational rule had no primary source — silent-fallback alerting — it is labelled `consensus` rather than dressed in a citation.
2. **No claim is made about specific model-registry products** (MLflow, W&B, and so on). The requirements above are stated as properties the artifact must have; which tool provides them is deliberately out of scope, for the same reason `selection.md` avoids naming a best model.

**Date the sources in this file were consulted:** 16 August 2026.
