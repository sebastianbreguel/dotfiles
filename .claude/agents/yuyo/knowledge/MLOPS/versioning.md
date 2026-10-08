---
updated: 2026-08-16
ttl: 12 months
sources: 12
---

# Yuyo — MLOps: versioning and reproducibility

**What it covers.** What has to travel together for a trained model to remain a thing you can explain, rebuild and roll back: the data it saw, the features it was fed, the library versions it was serialized under, the randomness it consumed, and the configuration that selected all of the above.

**When to read it.** When the diff adds or changes a training script, a serialized artifact, a feature definition, a dataset query used for training, a model or prompt identifier, a seed, or a pinned dependency of any of those.

**Backing scale.** `source` — paper, official documentation or standard, cited with URL. `consensus` — accepted practice without a single citable source. `debated` — two legitimate published positions; both are named and one is recommended with its tradeoff. Vendor material is marked as an interested party at the point of citation.

**Cross-references.** `C<n>` is a principle of `CORE.md`. `S<n>` is `serving.md`, `M<n>` is `monitoring.md`, both in this directory.

---

### V1. A model version is a tuple, not a filename

**What it requires.** Every trained artifact records, at minimum: the commit of the training code, an immutable identifier of the training dataset, the feature/preprocessing version, the resolved dependency versions, and the config that produced it. A version string that names only the artifact is not a version.

**When it applies.** A PR that writes a model to storage, registers it in a registry, or reads one by path or tag. The observable smell is a path like `models/classifier_v3.pkl` or `latest/` with nothing alongside it, and a training script whose only output is the artifact.

**Why it bites.** Six months later the model behaves differently than the numbers in the PR description, and there is no way to establish whether the model changed, the data changed, or the feature code changed. Every subsequent debugging session starts from zero. Xin et al. traced provenance graphs of 3000 production ML pipelines at Google covering over 450,000 trained models: at that density, lineage is the only thing that makes any individual model explainable.

**Backing.** `source` — Xin et al., "Production Machine Learning Pipelines: Empirical Analysis and Optimization Opportunities" (2021), https://arxiv.org/abs/2103.16007 ; Fowler/Thoughtworks, "Continuous Delivery for Machine Learning" (2019), which treats data pipeline, ML pipeline and model as separately version-controlled artifacts, https://martinfowler.com/articles/cd4ml.html (consultancy — interested party in ML delivery tooling). Extends `C15`.

---

### V2. Ship the recipe, not just the artifact

**What it requires.** A serialized model is only a cache of a computation. Whatever is needed to run that computation again — the training script, the dataset snapshot or the query plus the cutoff that reproduces it, and the pinned dependency set — must be persisted with it and must survive the person who trained it.

**When it applies.** Any PR that adds a `.pkl`, `.joblib`, `.pt`, `.onnx` or equivalent to storage; any deployment that loads one. Also any dependency bump in a service that loads a pre-trained artifact — that bump is a change to the model, even though the model file did not change.

**Why it bites.** This is the incident to keep in mind. A model was serialized under one minor version of its ML library and deployed. The training dataset was never snapshotted; the query that produced it drifted and the source rows were later compacted. A routine dependency upgrade moved the library forward. Loading the artifact under the new version did not raise a hard error — scikit-learn signals this with an `InconsistentVersionWarning`, a warning, not an exception — and the caller's broad exception handling turned the failure into a fallback path. The feature stopped working and nothing paged. Retraining was the obvious fix and was impossible: the data was gone. The model became a binary nobody could reproduce and nobody could replace.

The general form: **an artifact whose training inputs are not retained is a one-way door.** It can only be kept, never repaired. Pinning versions buys you time; retaining the recipe is what buys you the exit.

The scikit-learn documentation states the rule directly: use the same dependencies and versions in training and production, and "when training a model, it is important to record the training recipe (e.g. a Python script) and training set information, and metadata about all the dependencies to be able to automatically reconstruct the same training environment." It also warns that loading a model trained under older versions in an updated environment is not always possible and that retraining may be the only path.

**Backing.** `source` — scikit-learn, "Model persistence", Security & Maintainability Limitations, https://scikit-learn.org/stable/model_persistence.html (read 2026-08-16). Related: `C13` (silent degradation carries a labeled counter — the fallback in this incident had none), `S7` (rollback).

---

### V3. Freeze the upstream signals a model depends on, or accept that they will move

**What it requires.** When a feature is derived from a signal owned by another team, another model, or a mutable lookup table, either pin a versioned copy of that signal or declare in the PR that the model is expected to track it live. Silence is the failure mode.

**When it applies.** A feature that reads an embedding model, a taxonomy, a vocabulary, an IDF table, a currency or geo mapping, a "category" column populated by another service, or the output of another model. Observable as a training query joining a table that some other pipeline writes.

**Why it bites.** Sculley et al. call these unstable data dependencies: signals that change behavior over time, implicitly when the upstream is itself a model that retrains, or explicitly when a different team owns it and can update at any moment. Their example is precise and counter-intuitive: if an input signal was previously mis-calibrated, the model fit to that mis-calibration, and a silent upstream *fix* will have sudden ramifications downstream. Improvements upstream are as dangerous as regressions. The paper's mitigation is exactly the frozen versioned copy, and it is explicit that versioning carries its own cost — staleness and the maintenance of multiple versions.

**Backing.** `source` — Sculley et al., "Hidden Technical Debt in Machine Learning Systems", NeurIPS 2015, section 3, "Unstable Data Dependencies", https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf ; Zinkevich, "Rules of Machine Learning", Rule #31, on joining tables whose contents change between training and serving, https://developers.google.com/machine-learning/guides/rules-of-ml (Google — interested party, but the document is engineering guidance, not product marketing).

---

### V4. Declare the level of reproducibility you actually have

**What it requires.** State whether training is bit-identical, statistically equivalent, or neither, and set the seeds that make your claim true. If determinism is claimed, the seeds for every RNG in the stack must be set, not just the framework's.

**When it applies.** Any training or evaluation script. Observable as a `seed` argument that is set in one place but not in the others, or a comparison of two runs presented as evidence of an improvement.

**Why it bites.** The ML Test Score names this as Infra 1: "training twice on the same data should produce two identical models", because deterministic training is what makes diff-testing possible — refactoring feature-generation code and verifying it trains to an identical model is only meaningful if training is deterministic. The paper also notes that in practice training is often not reproducible, in part because of unpredictable orderings of training data.

The tooling is explicit about the limits. PyTorch documents that "completely reproducible results are not guaranteed across PyTorch releases, individual commits, or different platforms", that CPU and GPU runs may diverge under identical seeds, and that reproducing a run requires seeding PyTorch, Python's `random`, NumPy, and the `DataLoader` workers via `worker_init_fn` and `generator`. cuDNN adds two separate sources of nondeterminism: benchmark-driven algorithm selection, and nondeterministic algorithms unless `torch.use_deterministic_algorithms(True)` is set. That call also throws when an operation has no deterministic implementation, which is the useful behavior: it converts a silent nondeterminism into a loud one.

The reviewable consequence: a PR that reports "the new model is 1.2 points better" without a seed, or without repeated runs, has not shown an improvement — it has shown one draw. Extends `C14` and `C3`.

**Backing.** `source` — Breck et al., "The ML Test Score", Infra 1, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf ; PyTorch, "Reproducibility", https://docs.pytorch.org/docs/2.13/notes/randomness.html

---

### V5. Determinism versus averaging is a choice, and it has a cost

**What it requires.** Pick one and say which. Either you pay for deterministic kernels and single-seed comparability, or you accept nondeterminism and report a distribution over seeds instead of a point estimate. What is not acceptable is nondeterministic training compared as if it were deterministic.

**When it applies.** GPU training, distributed training, any pipeline where run-to-run variance is comparable to the effect size being claimed.

**Why it bites.** Position one: force determinism. The ML Test Score's argument is auditability and diff-testing — you cannot verify a feature-code refactor is behavior-preserving without it. Position two: accept nondeterminism and average it out. The same paper offers this as the alternative: "Besides working to remove nondeterminism as discussed above, ensembling models can help." PyTorch supplies the cost of position one plainly: "deterministic operations are often slower than nondeterministic operations, so single-run performance may decrease."

**Recommendation.** Determinism for anything you will need to diff, audit, or reproduce for a customer or a regulator; repeated seeds with a reported spread for research-grade comparisons where the training cost of determinism is real. The trap is choosing neither: a nondeterministic pipeline whose results are reported as if a single run settled the question. That is `C8` — a small n is not signal.

**Backing.** `debated` — Breck et al., "The ML Test Score", Infra 1 (determinism, and ensembling as the fallback), https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf ; PyTorch, "Reproducibility", on the performance cost, https://docs.pytorch.org/docs/2.13/notes/randomness.html

---

### V6. A dataset used for training carries a written record of what it is and what it may be used for

**What it requires.** Every training dataset has a short document: where it came from, how it was collected and filtered, what it contains, the population it represents, and what uses are out of scope. Same for the model: intended use, evaluation conditions, and where performance was measured disaggregated rather than in aggregate.

**When it applies.** A new training dataset, a change to how an existing one is assembled or filtered, or a model being reused for a purpose different from the one it was trained for.

**Why it bites.** Without it, the dataset's provenance lives in one person's head, and its constraints are re-derived by trial and error — usually after a model has already been reused somewhere it does not apply. Gebru et al. propose datasheets that document "motivation, composition, collection process, recommended uses"; Mitchell et al. propose model cards specifically to "clarify the intended use cases of machine learning models and minimize their usage in contexts for which they are not well suited". Reused-out-of-scope is the exact failure `S9` describes from the consumer side.

In review this is cheap to ask for and cheap to satisfy: a markdown file next to the training script, not a compliance program.

**Backing.** `source` — Gebru et al., "Datasheets for Datasets", https://arxiv.org/abs/1803.09010 ; Mitchell et al., "Model Cards for Model Reporting", https://arxiv.org/abs/1810.03993 (both read at abstract level; see the unverified section).

---

### V7. Configuration is the largest defect surface in an ML system, and it is versioned like code

**What it requires.** Feature lists, data selection windows, hyperparameters, thresholds, model identifiers and prompt identifiers live in reviewed, checked-in configuration, and the diff between two model configurations must be readable.

**When it applies.** Any PR that changes a training or inference setting. Observable as constants edited inline in a script, a feature list assembled at runtime, a model identifier read from an environment variable with no default recorded anywhere, or a hyperparameter changed in the same commit as unrelated refactoring.

**Why it bites.** Sculley et al. devote a full section to configuration debt, and the key observation is a scale argument: "in a mature system which is being actively developed, the number of lines of configuration can far exceed the number of lines of the traditional code. Each configuration line has a potential for mistakes." Their examples are the ones that actually happen — a feature was logged incorrectly between two dates; a feature is not available before a date; a feature is unavailable in production so a substitute is used at serving time. Their stated principles: it should be easy to express a config as a small delta from a previous one, easy to see the difference between two models visually, possible to assert basic facts automatically (feature count, transitive closure of data dependencies), possible to detect unused settings, and configurations should undergo full code review and be checked into a repository.

For LLM-backed systems the same rule covers the model identifier and the prompt version: they are configuration, they change behavior, and they belong in the diff.

**Backing.** `source` — Sculley et al., section 6, "Configuration Debt", https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf

---

### V8. Retraining must be executable by someone who is not the author

**What it requires.** The path from raw data to a registered model is a runnable pipeline with named steps, not a notebook plus institutional memory. Someone who has never seen the model must be able to produce a new one.

**When it applies.** A model whose retraining procedure is described in a PR body, a README, a notebook, or nowhere. Observable when the training entry point is not wired into anything that a scheduler or a CI job could invoke.

**Why it bites.** The ML Test Score frames it as an operational risk, not a hygiene preference: "Imagine a model that is manually retrained once or twice a year by a given engineer. If that engineer leaves the team, this process may be difficult to replicate — even carefully written instructions may become stale or incorrect over this kind of time horizon." Amershi et al., studying Microsoft teams, found that discovering, managing and versioning the data needed for ML applications is substantially more complex than in other software domains — the manual steps are exactly where that complexity hides.

Note the boundary: *how* that pipeline is scheduled, retried, made idempotent, or backfilled is ordinary backend engineering and belongs to `tech-lead`. What this layer asserts is only that the pipeline must exist as an artifact, and that its output must be reproducible from its recorded inputs.

**Backing.** `source` — Breck et al., "The ML Test Score", Monitor 3 discussion, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf ; Amershi et al., "Software Engineering for Machine Learning: A Case Study", ICSE 2019, https://www.microsoft.com/en-us/research/uploads/prod/2019/03/amershi-icse-2019_Software_Engineering_for_Machine_Learning.pdf ; Google Cloud, "Practitioners guide to MLOps" (retraining triggers and model registration), https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf (Google Cloud — interested party); Chip Huyen, "Real-time machine learning: challenges and solutions", on the model store as the piece that versions "all the code/artifacts needed to reproduce a model", https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html

---

## What changed

First version of this file (2026-08-16). Nothing superseded yet.

Two things to re-check at the next TTL review:

- The scikit-learn persistence page is actively maintained and its recommended formats have moved over time (`pickle` → `joblib` → `skops`). The version-compatibility warning quoted in `V2` has been stable, but verify the exact wording before quoting it.
- The PyTorch reproducibility page is versioned per release; the URL above pins a specific version. Confirm the guarantees have not been relaxed or tightened.

## Sources I could not open or verify

- **Gebru et al., "Datasheets for Datasets"** and **Mitchell et al., "Model Cards for Model Reporting"** — I read the arXiv abstract pages only, not the full PDFs. `V6` cites only claims stated in those abstracts.
- **Xin et al., "Production Machine Learning Pipelines"** — abstract only. The figure cited in `V1` (3000 pipelines, 450,000+ models, four months, at Google) is from the abstract; I did not read the analysis.
- **Uber's Michelangelo platform post** — attempted, returned HTTP 406, not cited anywhere in this layer.
- I did not find a primary, non-vendor source that quantifies how often the "lost training data" failure in `V2` occurs in the field. It is presented as a mechanism with a documented enabling condition (scikit-learn's own version-compatibility warning), not as a measured frequency.
