---
updated: 2026-08-16
ttl: 12 months
sources: 2
---

# Yuyo — MLOps

**What this layer covers.** The operational concerns that are genuinely specific to systems whose behavior comes from a trained model rather than from written logic: what a model version has to include to be reproducible, how the same feature ends up computed two different ways in two different places, how a model is put in front of traffic and taken back out, and how a system that is up and fast becomes wrong without anything erroring.

**When to load it.** When the diff touches a training script, a serialized model artifact, a feature used at inference, a model or prompt identifier, a promotion or deployment step for a model, a retraining trigger, a drift monitor, or a dependency on a model served by a third party. Always after `CORE.md`, which is read in full on every review.

---

## Scope boundary — read this before reporting anything from this layer

This agent reviews alongside `tech-lead`, which already owns, with evidence from this repository's own production PRs:

- queues, workers, consumers and concurrency
- idempotency and deduplication
- retries, backoff, dead-letter handling
- database migrations and schema change safety
- transaction boundaries
- generic observability: latency, error rates, dashboards, alerting mechanics
- backfills and batch reprocessing

**None of that is in this layer, even when it appears inside a training pipeline.** Roughly half of what the industry files under "MLOps" is ordinary backend engineering with a new label on it. A training job is a job. A feature backfill is a backfill. A model-serving endpoint is an endpoint. Those are `tech-lead`'s findings, and raising them here duplicates a reviewer who has better evidence for them than this layer does.

What is left after that subtraction is the part that only exists because there is a model in the system:

- an artifact whose behavior depends on data nobody kept
- the same feature computed twice and expected to agree
- a deployment whose correctness cannot be established from the code
- a system that degrades continuously instead of failing
- a change whose blast radius is unrelated to its diff size

That is what this layer is for. If a finding would be equally true with the model replaced by a hardcoded rule, it does not belong here.

**One shared boundary case.** `V8` says a retraining procedure must exist as a runnable pipeline rather than as a notebook plus institutional memory. That is an ML claim about reproducibility. *How* that pipeline is scheduled, retried, made idempotent or backfilled is `tech-lead`'s. Assert the first, hand over the second.

---

## Backing scale

- **`source`** — paper, official documentation or standard, cited with URL.
- **`consensus`** — accepted practice without a single citable source.
- **`debated`** — two legitimate published positions; both are named, one is recommended, and its tradeoff is stated. Never raised as a blocker.

Vendor and platform material (Google Cloud, Anthropic, model providers) is cited where it is the authoritative statement of its own behavior or the clearest published articulation of a practice, and is marked as an interested party at the point of citation.

Every principle in this layer is `source` or `debated`. There is no `evidence` tier here: this repository's review history contains no precedent on model versioning, skew or drift, so nothing in this layer can be sustained as local precedent. That changes how a finding is framed, not whether it is raised — explain the mechanism and cite the source, do not invoke a precedent that does not exist.

---

## versioning.md — model, dataset and feature versions; reproducibility

| | Principle | Observable trigger |
|---|---|---|
| V1 | A model version is a tuple, not a filename | An artifact written to storage or read by path/tag with no recorded commit, dataset id, feature version or resolved dependencies |
| V2 | Ship the recipe, not just the artifact | A `.pkl` / `.joblib` / `.pt` added or loaded; **also any dependency bump in a service that loads a pre-trained artifact** |
| V3 | Freeze the upstream signals a model depends on, or accept they will move | A feature reading another team's table, another model's output, an embedding model, a taxonomy or a lookup table |
| V4 | Declare the level of reproducibility you actually have | A seed set in one place but not the others; a metric improvement reported from a single run |
| V5 | Determinism versus averaging is a choice, and it has a cost (`debated`) | GPU or distributed training where run-to-run variance is comparable to the claimed effect size |
| V6 | A dataset carries a written record of what it is and what it may be used for | A new training dataset, a change to how one is assembled, or a model reused for a different purpose |
| V7 | Configuration is the largest defect surface, and it is versioned like code | Constants edited inline in a training script; a feature list built at runtime; a model or prompt identifier not in the diff |
| V8 | Retraining must be executable by someone who is not the author | A training entry point that no scheduler or CI job could invoke; a procedure described only in a README or a notebook |

## serving.md — training/serving skew, shadow deploys, rollback

| | Principle | Observable trigger |
|---|---|---|
| S1 | One feature, one implementation | The same transformation appearing in the serving code and in the training query or script |
| S2 | When you cannot share the code path, log the features you served and train on those | Online inference on request-time state that no batch job can reconstruct |
| S3 | A feature derived from a mutable source needs a point-in-time read | A training query joining a live table with no `as_of`, snapshot, or event-time filter; running-total feature names |
| S4 | Skew is measured, not asserted | Two feature implementations with no recurring job that compares them on the same example |
| S5 | A shared feature layer prevents skew; a premature one just adds a system (`debated`) | A second model wanting a feature the first already computes; a feature-store dependency introduced |
| S6 | A model must be blessed before it can be served | A pipeline whose last step writes the model to the serving location with no evaluation in between |
| S7 | Shadow first: mirror the traffic, discard the answer | A deployment that flips a model reference, runtime, or serving format in one commit |
| S8 | Shadow answers "is it broken"; only live traffic answers "is it better" (`debated`) | A PR justified as "the new model is better" for a model whose value is realized through user behavior |
| S9 | A rollback restores the model and everything it was trained with | A model artifact and its feature code deployed by different mechanisms or on different cadences |
| S10 | Know who consumes the model's output before you change it | Changing a threshold, a score scale, a label set, an embedding dimension, or a model whose output is persisted anywhere |

## monitoring.md — drift, silent degradation, retraining triggers

| | Principle | Observable trigger |
|---|---|---|
| M1 | Monitor the distribution of what the model outputs, not only that it responded | A new inference call whose only instrumentation is a latency histogram and an error counter |
| M2 | Distinguish drift in the inputs from drift in the relationship | Any PR, monitor or postmortem that says "the data drifted" without saying which of covariate / label / concept |
| M3 | Suspect your own pipeline before you blame the world | A drift alarm; a metric regression whose proposed fix is "retrain" |
| M4 | A model you consume through an API changes without your deploy | A model identifier with no version suffix, a "latest" alias, or a provider migration treated as a rename |
| M5 | Model staleness is a measured quantity with a known cost | A retraining schedule with no degradation curve behind it; a model trained once and never revisited |
| M6 | Name the retrain trigger, and name who blesses the result (`debated`) | A cron entry with no promotion gate; a drift alert with no defined action |
| M7 | The drift statistic and the comparison window are choices that decide what you can detect (`debated`) | A drift detector added without stating the statistic, the baseline, or the window |
| M8 | CACE — changing anything changes everything, so there is no small feature change | Any diff touching a model input, especially the ones that look trivial: a normalization, a null fill, one added column, a tightened training filter |
| M9 | A model that shapes its own training data needs a deliberate break in the loop | A training set built from logged outcomes of the model's own decisions: ranking, routing, or a classifier that decides what a human reviews |

---

## Anchor sources

Two documents carry most of this layer and are worth reading in full rather than through the citations:

- **Sculley et al., "Hidden Technical Debt in Machine Learning Systems", NeurIPS 2015** — https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf . Nine pages, no equations. Names the problem space: CACE, entanglement, correction cascades, undeclared consumers, unstable and underutilized data dependencies, glue code, pipeline jungles, configuration debt, feedback loops. `V3`, `V7`, `S10`, `M1`, `M8` and `M9` come from it.
- **Zinkevich, "Rules of Machine Learning" (Google)** — https://developers.google.com/machine-learning/guides/rules-of-ml . 43 rules from applied practice. Rules #8, #9, #29, #31, #32 and #37 are the ones this layer uses; the training/serving skew section is the best short treatment of `S1`–`S4` anywhere.

Supporting, in rough order of how much this layer leans on them: Breck et al.'s "The ML Test Score" (28 concrete tests, the backbone of `V4`, `S4`, `S6`, `S9`, `M5`); Breck et al.'s "Data Validation for Machine Learning" (SysML 2019, the three categories of skew); Chip Huyen's "Data Distribution Shifts and Monitoring" (the drift taxonomy in `M2`, and the honest treatment of detection limits in `M7`).

---

## What changed

First version of this layer (2026-08-16).

## Sources I could not open or verify

Per-file lists are at the end of each file. Across the layer:

- **Read at abstract level only, not in full:** Paleyes et al. (2011.09926), Chen/Zaharia/Zou (2307.09009), Lu et al. (2004.05785), Mitchell et al. (1810.03993), Gebru et al. (1803.09010), Klaise et al. (2007.06299), Xin et al. (2103.16007). Every claim attributed to these is stated in the abstract; nothing is inferred from unread body text.
- **Attempted and failed:** Uber's Michelangelo engineering post (HTTP 406). It is the canonical industry write-up on shared feature pipelines and would have strengthened `S5`; it is not cited.
- **Deliberately not cited:** the vendor shadow-deployment guides that dominate search results for that term (Atlan, DHIwise, item.com and similar). They agree with each other and with the sources used here, but none is a primary account of a system in production.
- **No source found:** a study settling automated model promotion versus human promotion (`M6`) with evidence rather than advocacy, and a measured frequency for the lost-training-data failure in `V2`. Both are marked accordingly.
