---
updated: 2026-08-16
ttl: 12 months
sources: 9
---

# Yuyo — MLOps: serving, skew and rollback

**What it covers.** What happens when a trained model meets live traffic: the gap between how a feature is computed in training and how it is computed at inference, how to prove that gap is zero, how to put a new model in front of real requests without betting the product on it, and what has to be restored for a rollback to actually be a rollback.

**When to read it.** When the diff touches a feature computation used at inference, a prediction endpoint, a model-loading path, a deployment or promotion step for a model, or the way another system consumes a model's output.

**Backing scale.** `source` — paper, official documentation or standard, cited with URL. `consensus` — accepted practice without a single citable source. `debated` — two legitimate published positions; both are named and one is recommended with its tradeoff. Vendor material is marked as an interested party at the point of citation.

**Cross-references.** `C<n>` is `CORE.md`. `V<n>` is `versioning.md`, `M<n>` is `monitoring.md`.

---

### S1. One feature, one implementation

**What it requires.** A feature is computed by one piece of code, called from both the training path and the inference path. If the same feature is computed twice, in two places, in two languages, or by two teams, that is the defect — not the risk of one.

**When it applies.** Any PR that adds a feature to a model. The trigger is visible in the diff: a transformation appears in the serving code and a matching one appears (or is expected to appear) in the training query or training script. Also visible as a training pipeline in SQL or Spark and a serving path in application code.

**Why it bites.** This is the single most classic ML bug, and it is silent by construction. The model does not error; it receives a subtly different number than the one it was fit on and returns a subtly worse answer. Zinkevich's Rule #32 is direct: re-use code between training and serving pipelines wherever possible, because "this eliminates a source of training-serving skew", and adds the corollary that using two different programming languages between training and serving makes sharing code nearly impossible.

The ML Test Score gives the concrete mechanism: adding a new feature to an existing production system computes the value at serving time from live user behavior, but the feature is absent from training data, so it is backfilled by imputing it from stored data "likely using an entirely independent codepath". Two codepaths that are supposed to agree, written months apart, by different people, with no test that compares them.

**Backing.** `source` — Zinkevich, "Rules of Machine Learning", Rule #32, https://developers.google.com/machine-learning/guides/rules-of-ml (Google — interested party, but engineering guidance rather than product material); Breck et al., "The ML Test Score", Monitor 3, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf

---

### S2. When you cannot share the code path, log the features you served and train on those

**What it requires.** If training and serving genuinely cannot run the same code, then the serving path becomes the source of truth: log the exact feature vector used to produce each prediction, and build the training set from those logs rather than reconstructing features from raw data.

**When it applies.** Online inference where features depend on request-time state that no batch job can reproduce — session context, live inventory, current queue depth, anything derived from the request itself.

**Why it bites.** Reconstructing a request-time feature after the fact means guessing what the value *was*, and the guess is systematically wrong in the direction that flatters the model. Zinkevich's Rule #29 states the practice and its return: logging features at serving time is "the best way to make sure that you train like you serve", and notes that YouTube's home page switched to serving-time feature logging with "significant quality improvements and a reduction in code complexity". Even a small sampled fraction is enough to verify consistency.

The cost is real: logging feature vectors is storage and it is PII surface. Sample it, and put a retention window on it. That tradeoff is worth naming in the PR rather than skipping the logging.

**Backing.** `source` — Zinkevich, "Rules of Machine Learning", Rule #29, https://developers.google.com/machine-learning/guides/rules-of-ml

---

### S3. A feature derived from a mutable source needs a point-in-time read

**What it requires.** When a training feature is computed by querying something that keeps changing — a counter, an aggregate, a status column, another team's table — the query must reconstruct the value as of the moment the prediction was made, not as of the moment training runs.

**When it applies.** Observable in the training query: a join against a live table with no `as_of` timestamp, no snapshot, and no event-time filter. Also observable as a feature named like a running total (`total_clicks`, `order_count`, `messages_sent`) computed with a plain aggregate.

**Why it bites.** Breck et al. name this "time travel", and their example is exact: a feature is the number of clicks on an ad impression, obtained by querying a database. If the training data is generated by querying the same database later, the click count for each impression appears higher than it was at serving time, because it includes all the clicks that happened between serving and training-set generation. The model is trained on a variable that, at inference time, does not yet have that value. Offline metrics look excellent. Production performance does not match, and the discrepancy is not explainable from the model.

Zinkevich's Rule #31 is the same hazard from the other direction and offers the weaker mitigation honestly: snapshotting the table hourly or daily gets you "reasonably close", and "note that this still doesn't completely resolve the issue".

**Backing.** `source` — Breck, Polyzotis, Roy, Whang, Zinkevich, "Data Validation for Machine Learning", SysML 2019, section on training-serving skew, https://mlsys.org/Conferences/2019/doc/2019/167.pdf ; Zinkevich, "Rules of Machine Learning", Rule #31, https://developers.google.com/machine-learning/guides/rules-of-ml

---

### S4. Skew is measured, not asserted

**What it requires.** Do not claim the two paths agree. Prove it: take the same example through the training path and the serving path and assert the feature values are identical, on a recurring basis, with an alert when they diverge.

**When it applies.** Any system with separate training and serving feature computation, which is most of them. The trigger for asking is `S1` being violated for a defensible reason.

**Why it bites.** Because "they should be the same" and "they are the same" are different statements, and the ML Test Score's summary of practice is that "the different codepaths should generate the same values, but in practice a common problem is that they do not". The published mechanism is concrete and implementable: attach an identifier to each example at serving time and do a key-join between corresponding batches of training and serving data followed by a feature-wise comparison. Breck et al. distinguish three kinds:

- **Feature skew** — the same feature takes different values in training versus serving for the same example. Caused by divergent code paths, or by time travel (`S3`).
- **Distribution skew** — the feature values are individually correct but the distributions differ. Detected with a distance measure between distributions, not by equality. Note the important caveat: these distributions are *expected* to differ, since each day's examples differ from the last, so the question is always how much, not whether.
- **Scoring/serving skew** — only a subset of scored examples is actually served. Ten of a hundred scored videos are shown; a click makes one a positive and nine negatives; the ninety never served have no labels and never enter training. This is an implicit feedback loop, and it connects to `M9`.

The reviewable version of this principle: for a feature computed twice, ask what would fail if the two implementations diverged, and whether anything currently would.

**Backing.** `source` — Breck et al., "Data Validation for Machine Learning", SysML 2019, https://mlsys.org/Conferences/2019/doc/2019/167.pdf ; Breck et al., "The ML Test Score", Monitor 3, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf

---

### S5. A shared feature layer prevents skew; a premature one just adds a system

**What it requires.** Decide deliberately between three levels: a shared function called by both paths, a shared feature repository, or a full feature store. Do not adopt the heaviest one because it is the one with the name.

**When it applies.** When a second model wants a feature the first one already computes, or when a PR introduces a feature-store dependency.

**Why it bites.** Position one, the platform case: Google Cloud's MLOps material makes the feature store the mechanism that avoids skew — "the same set of data entities for multiple uses", one definition serving experimentation, continuous training and online prediction, and the explicit benefit of avoiding "similar features that have different definitions". Position two, the skeptical case: Chip Huyen's survey of what feature stores actually do notes they cover a narrower slice than the marketing suggests — they handle streaming computation only for data that needs no joins, so they are unlikely to orchestrate an entire feature computation flow, and some managed offerings store only materialized values while the computation lives elsewhere. Both are true. The platform pays off at N models sharing M features; below that it is a system to operate for one consumer.

**Recommendation.** Start with `S1` — a shared function, in one language, called by both paths. Promote to a feature repository when a second model consumes the same feature. Adopt a feature store when the online/offline serving requirements genuinely diverge (low-latency point lookups plus high-throughput batch). The tradeoff: the shared function is free but only prevents skew inside one service; the feature store prevents it across an organization and costs an operated system, a schema to maintain, and a new place for staleness to hide.

**Backing.** `debated` — Google Cloud, "MLOps: Continuous delivery and automation pipelines in machine learning", feature store section, https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning (Google Cloud — interested party, sells the managed feature store); Chip Huyen, "Real-time machine learning: challenges and solutions", appendix "What do feature stores do?", https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html

---

### S6. A model must be blessed before it can be served

**What it requires.** Between "training finished" and "traffic reaches it" there is an automated gate that evaluates the candidate and can veto it. Training success is not a quality signal.

**When it applies.** Any automated or scheduled retraining. Observable when a pipeline's last step is "write model to serving location" with no evaluation between.

**Why it bites.** Zinkevich's Rule #9 makes the asymmetry the argument: "Issues about models that haven't been exported require an e-mail alert, but issues on a user-facing model may require a page. So better to wait and be sure before impacting users." The ML Test Score's Infra 4 states it as a requirement — an automated system must inspect the model and "either bless the model or veto it, terminating its entry to the serving environment".

The gate has to include slices, not just an aggregate. ML Test Score Model 6 asks that quality be sufficient on all important data slices, because a model can improve on average while collapsing on a segment that matters. That is `C9` applied to a promotion decision.

**Backing.** `source` — Zinkevich, "Rules of Machine Learning", Rule #9, https://developers.google.com/machine-learning/guides/rules-of-ml ; Breck et al., "The ML Test Score", Infra 4 and Model 6, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf

---

### S7. Shadow first: mirror the traffic, discard the answer

**What it requires.** Run the new model on real production requests in parallel with the incumbent, log its inputs and outputs, and do not return them to anyone. Compare afterwards.

**When it applies.** Replacing a model, changing a serving library or runtime, converting a model to a different format, or changing the feature path in front of a model. Observable as a deployment that flips a model reference in one commit.

**Why it bites.** Because the things that break at cutover are the things offline evaluation cannot see: real input distributions including the tail, latency under real concurrency, numeric differences introduced by format conversion or a different runtime, and integration mismatches. Shadow mode exposes all of them at zero customer risk, since the shadow's output never leaves the system. Samiullah's write-up lists what to compare once running: the raw data entering the pipeline (errors, missing values, unexpected queries), the generated features (statistical irregularities), and the predictions versus what the research environment produced — and if there is a divergence, whether it was expected. It also flags the part teams get wrong: how long to observe. On low-traffic or timing-sensitive systems a fair comparison needs data spanning both weekdays and weekends, sometimes months, not a few hours.

Google Cloud's practitioner material places shadow deployments alongside canary and blue-green as progressive delivery used for smoke testing — service errors, latency, throughput — before online experimentation measures effectiveness.

**Backing.** `source` — Samiullah, "Deploying Machine Learning Models in Shadow Mode" (2019), https://christophergs.com/machine%20learning/2019/03/30/deploying-machine-learning-applications-in-shadow-mode/ (independent practitioner blog, not a vendor); Google Cloud, "Practitioners guide to MLOps", progressive delivery section, https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf (Google Cloud — interested party).

---

### S8. Shadow answers "is it broken"; only live traffic answers "is it better"

**What it requires.** Do not let a clean shadow run substitute for a controlled online comparison when the claim being made is about business outcome.

**When it applies.** Any PR whose justification is "the new model is better" for a model whose value is realized through user behavior — ranking, recommendation, routing, pricing, anything with a feedback loop.

**Why it bites.** Position one: shadow is sufficient and safest. Its defining property is that users never see the new model's predictions, so a regression causes zero customer-facing incidents, and it costs double inference for the observation window. Position two: shadow structurally cannot measure impact. A shadow model's predictions are never acted on, so no user ever responds to them, so no engagement, conversion or revenue signal exists for it. Google Cloud's material draws exactly this line: progressive delivery techniques do smoke testing focused on service efficiency and errors, and *then* "you test the model's effectiveness in production by gradually serving it alongside the existing model and running online experiments", noting that deciding whether a candidate should replace the production model "is a more complex and multi-dimensional task compared to deploying other software assets".

**Recommendation.** Shadow for correctness, latency and input-distribution alignment. Canary or A/B for value. Merging the two questions is how a model with worse business outcomes ships on the strength of a clean technical comparison. This is `C18` at the deployment boundary: every model metric comes with a business metric.

**Backing.** `debated` — Google Cloud, "Practitioners guide to MLOps", https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf (Google Cloud — interested party); Samiullah, "Deploying Machine Learning Models in Shadow Mode", https://christophergs.com/machine%20learning/2019/03/30/deploying-machine-learning-applications-in-shadow-mode/

---

### S9. A rollback restores the model and everything it was trained with

**What it requires.** Reverting a model deployment must also revert the feature computation code, the preprocessing, the configuration, and any schema the model expects. If those ship independently, the rollback puts an old model behind new inputs.

**When it applies.** Any PR that changes a model *and* a feature or preprocessing step in the same change, or that changes one of them while the other is deployed on a separate cadence. Observable as a model artifact deployed by one mechanism and its feature code by another.

**Why it bites.** Rolling back only the artifact produces a configuration that was never tested and never trained: the previous model receiving the new feature encoding. That is worse than either state. The ML Test Score treats rollback as a first-class requirement — Infra 7, "being able to quickly revert to a previous known-good state is as crucial with ML models as with any other aspect of a serving system" — and adds the part teams skip: "Because rolling back is an emergency procedure, operators should practice doing it." An unrehearsed rollback discovered during an incident is not a rollback.

`V1` is the enabler: you cannot restore the tuple if you never recorded it.

**Backing.** `source` — Breck et al., "The ML Test Score", Infra 7, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf

---

### S10. Know who consumes the model's output before you change it

**What it requires.** Before changing a model's output — its scale, its calibration, its label set, its schema, or the model itself — enumerate what reads it. Predictions written to a table, a log, a queue, or a cache have consumers you did not authorize.

**When it applies.** Changing a threshold, switching from raw score to calibrated probability, adding or removing a class, changing an embedding's dimensionality or the model that produces it, or replacing a model whose output is persisted anywhere.

**Why it bites.** Sculley et al. name this undeclared consumers, and the reasoning is what makes it a review item rather than a documentation item: a prediction made "widely accessible, either at runtime or by writing to files or logs" gets silently used as an input by other systems, creating "a hidden tight coupling" such that changes to the model "will very likely impact these other parts, potentially in ways that are unintended, poorly understood, and detrimental". Their sharpest point is about velocity, not correctness: this coupling "can radically increase the cost and difficulty of making any changes at all, even if they are improvements". And they note why it happens — "in the absence of barriers, engineers will naturally use the most convenient signal at hand, especially when working against deadline pressures."

Embeddings are the acute modern case. Vectors produced by one model, persisted in an index, silently read by a second feature. Changing the embedding model invalidates every stored vector, and nothing enforces that.

The practical review question is one line: what reads this column, this topic, this index? If the answer is unknown, that is the finding.

**Backing.** `source` — Sculley et al., "Hidden Technical Debt in Machine Learning Systems", section 2, "Undeclared Consumers", https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf ; Paleyes, Urma, Lawrence, "Challenges in Deploying Machine Learning: a Survey of Case Studies", which maps reported deployment challenges across the workflow, https://arxiv.org/abs/2011.09926

---

## What changed

First version of this file (2026-08-16). Nothing superseded yet.

To re-check at the next TTL review: whether the feature-store debate in `S5` has resolved. Since 2022 the category has partly consolidated into broader data platforms; if the operational cost of a managed feature store has dropped materially, the recommendation's break-even point moves earlier.

## Sources I could not open or verify

- **Paleyes et al., "Challenges in Deploying Machine Learning"** — abstract only, not the full survey. `S10` cites it only as corroborating context, and no specific case study from it is quoted.
- **Uber's Michelangelo engineering post** — the canonical industry write-up on shared feature pipelines. The fetch returned HTTP 406, so it is not cited. `S5` rests on Google Cloud and Chip Huyen instead.
- Several widely circulated shadow-deployment guides surfaced in search were vendor content (Atlan, DHIwise, item.com). None are cited; `S7` and `S8` use an independent practitioner post and Google Cloud's own material, with the latter marked as an interested party.
