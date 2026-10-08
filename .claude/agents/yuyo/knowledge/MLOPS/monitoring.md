---
updated: 2026-08-16
ttl: 12 months
sources: 13
---

# Yuyo — MLOps: drift, silent degradation and retraining

**What it covers.** The failure mode that has no exception and no error rate: a model that is up, fast, and increasingly wrong. What to watch, how to tell a shifting world from a broken pipeline, when a retrain is the answer and when it is not, and why "a small change to one feature" is not a small change.

**When to read it.** When the diff adds or changes a model-backed decision in production, a feature that feeds one, a retraining schedule or trigger, a threshold, a monitor over model outputs, or a dependency on a model served by a third party.

**Backing scale.** `source` — paper, official documentation or standard, cited with URL. `consensus` — accepted practice without a single citable source. `debated` — two legitimate published positions; both are named and one is recommended with its tradeoff. Vendor material is marked as an interested party at the point of citation.

**Cross-references.** `C<n>` is `CORE.md`. `V<n>` is `versioning.md`, `S<n>` is `serving.md`.

---

### M1. Monitor the distribution of what the model outputs, not only that it responded

**What it requires.** A model-backed endpoint needs a monitor over the *content* of its predictions — the mean predicted score, the class mix, the rate of the abstain or fallback branch — sliced by whatever dimension matters. Uptime, latency and error rate are necessary and prove nothing about correctness.

**When it applies.** Any PR that adds a model-backed decision to production. Observable as a new inference call whose only instrumentation is a latency histogram and an error counter.

**Why it bites.** A model that has stopped working returns HTTP 200. Nothing in the request path is aware of it. Sculley et al. propose the simplest useful invariant, prediction bias: "in a system that is working as intended, it should usually be the case that the distribution of predicted labels is equal to the distribution of observed labels", and they are candid that it is not a comprehensive test — a null model predicting average label rates satisfies it — but "it is a surprisingly useful diagnostic", and it can detect the case where world behavior suddenly changes and historical training distributions stop reflecting reality. They add the part that makes it operational: slice the bias by dimension, which isolates issues quickly and can drive automated alerting.

The ML Test Score's Monitor 3 gives the calibrated form: models should have zero bias in aggregate and on slices — 90% of predictions of probability 0.9 should in fact be positive.

Chip Huyen orders the four artifacts worth monitoring by how far into the pipeline they sit — accuracy-related metrics, predictions, features, raw inputs — with the useful asymmetry: the deeper the artifact, the more likely a change is caused by a bug in one of the transformations, but also the closer it is to what you actually care about and the easier it is to monitor. Predictions are the cheapest place to start: low-dimensional, and a shift in them is directly interpretable.

**Backing.** `source` — Sculley et al., "Hidden Technical Debt in Machine Learning Systems", section 7, "Monitoring and Testing", https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf ; Breck et al., "The ML Test Score", Monitor 3, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf ; Chip Huyen, "Data Distribution Shifts and Monitoring", https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html . Extends `C13`.

---

### M2. Distinguish drift in the inputs from drift in the relationship

**What it requires.** When a PR or an incident says "the data drifted", establish which of three things it means, because they call for different responses. Writing "drift" without the qualifier is the finding.

**When it applies.** Any drift monitor, any retraining justification, any postmortem that attributes a regression to changing data.

**Why it bites.** Chip Huyen gives the decomposition cleanly. With inputs X and outputs Y, the joint P(X, Y) factors two ways, and the three shifts are distinct:

- **Covariate shift** — P(X) changes, P(Y|X) stays. The population you see changed; the underlying rule did not. A model can often survive this, and retraining on fresh data usually helps.
- **Label shift** — P(Y) changes, P(X|Y) stays. Base rates moved. Thresholds calibrated under the old base rate are now wrong even if the model is fine. This is `C4` triggered by the world rather than by a code change.
- **Concept drift** — P(Y|X) changes, P(X) stays. "Same input, different output." Her example is exact: a three-bedroom San Francisco apartment cost $2,000,000 before COVID-19 and $1,500,000 at the beginning of it, with the distribution of house features unchanged. Nothing in the inputs looks different. An input-drift monitor sees nothing at all.

She also notes that concept drift is frequently cyclic or seasonal — rideshare prices on weekdays versus weekends, flight prices in holiday seasons — which is why some teams keep separate models rather than treating the cycle as a fault.

The reviewable consequence: an input-drift alarm is not evidence that the model degraded, and the absence of one is not evidence that it did not. Concept drift is the case that only a label or an outcome proxy can catch.

**Backing.** `source` — Chip Huyen, "Data Distribution Shifts and Monitoring", "Types of Data Distribution Shifts", https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html ; Lu, Liu, Dong, Gu, Gama, Zhang, "Learning under Concept Drift: A Review" (2020), https://arxiv.org/abs/2004.05785

---

### M3. Suspect your own pipeline before you blame the world

**What it requires.** When a drift monitor fires, the first hypothesis is a bug in your system, not a change in reality. Check the feature path, the model version actually loaded, and the imputation of missing values before writing "the distribution shifted".

**When it applies.** Any drift investigation. Also any PR that proposes to fix a metric regression by retraining.

**Why it bites.** Chip Huyen states it plainly: "due to the complexity of ML systems and the poor practices in deploying them, a large percentage of what might look like data shifts on monitoring dashboards are caused by internal errors" — she lists bugs in the data pipeline, missing values incorrectly filled in, inconsistencies between features extracted during training and inference, features standardized using statistics from the wrong subset of data, the wrong model version, and app-interface bugs that force users to change behavior.

Retraining on top of a broken feature path does not fix anything. It bakes the bug into a new model and destroys the evidence, because the new model now fits the corrupted inputs and the drift signal disappears. That is the expensive version of this mistake: a monitor that stops firing without the problem being solved.

Breck et al. frame this as the reason to validate data as an asset in its own right: errors in input data "can nullify any benefits on speed and accuracy for training and inference", and small data errors get amplified by ML pipelines' feedback loops into "gradual regression of model performance over a period of time".

**Backing.** `source` — Chip Huyen, "Data Distribution Shifts and Monitoring", "Production Data Differing From Training Data", https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html ; Breck et al., "Data Validation for Machine Learning", SysML 2019, https://mlsys.org/Conferences/2019/doc/2019/167.pdf . Extends `C6`.

---

### M4. A model you consume through an API changes without your deploy

**What it requires.** Any dependency on a model served by someone else — an LLM provider, an embedding API, a hosted classifier — is pinned to a specific model identifier, and there is a monitor that would notice if its behavior changed underneath you. A floating alias is a live dependency on someone else's release schedule.

**When it applies.** Observable in the diff as a model name without a version suffix, a "latest" alias, or a model identifier read from configuration with no recorded value. Also when a provider announces a deprecation and the migration is treated as a rename.

**Why it bites.** This is Sculley's unstable data dependency (`V3`) with the ownership boundary now outside the company. Chen, Zaharia and Zou measured it: evaluating the March 2023 and June 2023 versions of GPT-3.5 and GPT-4 across seven task families, they found "the performance and behavior of both GPT-3.5 and GPT-4 can vary greatly over time" — GPT-4 went from 84% to 51% accuracy on identifying prime versus composite numbers between the two snapshots, partly explained by a drop in its responsiveness to chain-of-thought prompting, while GPT-3.5 improved on the same task over the same period. They also observe that "when and how these models are updated over time is opaque." Behavior moved in both directions, on the same task, with no action from any consumer.

Provider documentation confirms the structural point rather than contradicting it. Anthropic's deprecations page describes a lifecycle of active, deprecated and retired states, states that models are retired to ensure capacity for new releases, and lists among the acknowledged downsides that "researchers lose access to models for ongoing and comparative studies". Retirement is a scheduled fact, not an anomaly. Treat it as a dependency with an expiry date: pin the version, keep a small evaluation set that runs against it, and re-run that set on migration rather than assuming the replacement is a drop-in.

**Backing.** `source` — Chen, Zaharia, Zou, "How is ChatGPT's behavior changing over time?" (2023), https://arxiv.org/abs/2307.09009 ; Anthropic, "Model deprecations", https://docs.anthropic.com/en/docs/about-claude/model-deprecations (model vendor — interested party; cited only for its own stated lifecycle policy). Related: `C3`, and `A14` in `LLM/prompts.md` on floating aliases.

---

### M5. Model staleness is a measured quantity with a known cost

**What it requires.** Know how much quality is lost when the model is one day, one week, one quarter old, and monitor the age of the deployed model against that curve.

**When it applies.** Any model that is retrained on a schedule, and any model that is not. The second case is the one that gets missed: a model trained once and never revisited has an unbounded staleness with an unmeasured cost.

**Why it bites.** Zinkevich's Rule #8 makes the measurement the input to the monitoring decision: "How much does performance degrade if you have a model that is a day old? A week old? A quarter old? This information can help you to understand the priorities of your monitoring." He notes that Google Play Search degrades noticeably in under a month if not updated, while some models can be exported infrequently — and, importantly, that freshness requirements change over time, especially when feature columns are added or removed.

The ML Test Score splits this into two tests, and the split is the useful part. Model 4 asks that the *impact* of staleness be known — measured by evaluating older models on current data. Monitor 4 asks that the system then watch the age of the model in production against it, and adds a detail worth copying: measure the age at each stage of the training pipeline, so a stall can be located rather than merely detected.

Without the curve, "the model is three months old" is not information. With it, it is either fine or an incident.

**Backing.** `source` — Zinkevich, "Rules of Machine Learning", Rule #8, https://developers.google.com/machine-learning/guides/rules-of-ml (Google — interested party, engineering guidance); Breck et al., "The ML Test Score", Model 4 and Monitor 4, https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf

---

### M6. Name the retrain trigger, and name who blesses the result

**What it requires.** A retraining setup states which of the standard triggers it uses and who or what decides that the resulting model may serve. "It runs nightly" answers half the question.

**When it applies.** Any scheduled or automated training pipeline. Observable as a cron entry with no promotion gate, or a drift alert with no defined action.

**Why it bites.** Google Cloud enumerates the trigger options usefully: on demand, on a schedule, on availability of new training data, on observed performance degradation, and on significant changes in the data distributions. The choice matters because it determines what the system can and cannot respond to — a schedule cannot react to an abrupt shift, and a drift trigger cannot fire on concept drift that leaves P(X) unchanged (`M2`).

The genuinely contested part is who promotes. **Position one, full continuous training:** the pipeline retrains and deploys automatically when triggered; the argument is that a human in the loop is the reason models sit stale for months, and that automated data and model validation are more consistent than a person reviewing an offline metric. **Position two, automated training with human promotion:** the pipeline produces a *candidate*, registers it, and a person approves the release. Google Cloud's own practitioner material describes this second shape — the registered model is "annotated, reviewed, and approved for release" before deployment — even while advocating continuous training.

**Recommendation.** Automate training; gate promotion. Concretely: retraining runs without a human, the model validation step (`S6`) has veto power, and a human approves the promotion for anything customer-facing or hard to reverse. The tradeoff is honest — you trade update latency for the ability to catch the case where the validation gate itself is fooled, which is the case that hurts, because a bad model promoted automatically at 3am is discovered by customers. Where the model is genuinely low-stakes and rollback is instant (`S9`), full automation is defensible; say so explicitly rather than defaulting into it.

**Backing.** `debated` — Google Cloud, "MLOps: Continuous delivery and automation pipelines in machine learning", ML pipeline triggers, https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning ; Google Cloud, "Practitioners guide to MLOps", model registration and release approval, https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf (both Google Cloud — interested party, sells the pipeline tooling); Chip Huyen, "Real-time machine learning: challenges and solutions", on retraining frequency being set by gut feeling at most companies, https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html

---

### M7. The drift statistic and the comparison window are choices that decide what you can detect

**What it requires.** A drift monitor states what it compares (which statistic), against what baseline, over what window. Defaults chosen silently are the reason drift monitors are either noisy or blind.

**When it applies.** Any PR adding a drift detector or a data-quality alert over model inputs.

**Why it bites.** **Position one, summary statistics.** Compare mean, median, variance and quantiles between training and inference. Chip Huyen notes this is what many companies do and, as of her writing, what TensorFlow Extended's built-in data validation used for skew and drift. It is cheap and interpretable. Her critique is precise: these are "far from sufficient", because mean, median and variance are only useful for distributions where they are useful summaries — if they differ, something probably shifted, but "if those metrics are similar, there's no guarantee that there's no shift."

**Position two, two-sample hypothesis tests.** Statistically principled, and the direction the monitoring literature points; Klaise et al. describe drift and outlier detection with statistical techniques as a core area of production model monitoring. The cost is that on production volumes, a two-sample test will find statistically significant differences that are operationally irrelevant, producing alerts nobody can act on.

Underneath both sits the window problem, which is the part most often skipped. Chip Huyen's illustration: with a weekly cycle in the data, a window shorter than a week cannot see the cycle, and whether day 15 looks like a shift depends entirely on whether the baseline is days 9–14 or days 1–14. The same data yields "drift" or "no drift" depending on a parameter nobody wrote down. She also notes abrupt shifts are easier to detect than slow gradual ones — which is backwards from what hurts, since the slow ones are the ones that reach customers.

**Recommendation.** Start with summary statistics on a small number of features that actually feed the decision, with a baseline window long enough to contain your slowest business cycle, and alert only where an action exists. Add two-sample tests where a feature is important enough to justify tuning the false-positive rate. Breck et al.'s framing keeps this honest: the training and serving distributions are *expected* to differ, since each day differs from the last, so the question is never whether the distance is positive but whether it exceeds a threshold you chose on purpose. That is `C4`.

**Backing.** `debated` — Chip Huyen, "Data Distribution Shifts and Monitoring", statistical methods and time-scale windows, https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html ; Klaise, Van Looveren, Cox, Vacanti, Coca, "Monitoring and explainability of models in production", ICML 2020 workshop, https://arxiv.org/abs/2007.06299 ; Breck et al., "Data Validation for Machine Learning", SysML 2019, on quantifying distribution distance, https://mlsys.org/Conferences/2019/doc/2019/167.pdf

---

### M8. CACE: changing anything changes everything, so there is no small feature change

**What it requires.** A PR that adds, removes or modifies a single feature, threshold, sampling rule or hyperparameter must be evaluated as a change to the whole model, not to that feature. The evidence required is a before/after comparison of the model's outputs, not a review of the feature's code.

**When it applies.** Every diff that touches a model input. Especially the ones that look trivial: normalizing a field, fixing a null, adding a column that "the model will just ignore if it isn't useful", tightening a filter on training data.

**Why it bites.** This is the principle at the center of Sculley et al., and it is worth stating in their words because the scope is wider than most people assume: "consider a system that uses features x1, ...xn in a model. If we change the input distribution of values in x1, the importance, weights, or use of the remaining n − 1 features may all change. This is true whether the model is retrained fully in a batch style or allowed to adapt in an online fashion. Adding a new feature xn+1 can cause similar changes, as can removing any feature xj. No inputs are ever really independent. We refer to this here as the CACE principle: Changing Anything Changes Everything." And then the sentence that decides how to review: "CACE applies not only to input signals, but also to hyper-parameters, learning settings, sampling methods, convergence thresholds, data selection, and essentially every other possible tweak."

The practical consequence for review is a reversal of the usual heuristic. In ordinary backend code, a small diff justifies a light review. In a model, the size of the diff carries no information about the size of the behavior change: a one-line change to a normalization step redistributes weight across every other feature. The proportionate response is not a longer code review — it is insisting on the comparison (`C3`) and on slice-level results (`C9`), because that is the only thing that observes the effect.

Two mitigations from the same paper, both with their own cost. Isolating models and serving ensembles works where sub-problems decompose naturally, but creates its own entanglement: "improving an individual component model may actually make the system accuracy worse if the remaining errors are more strongly correlated with the other components." Detecting changes in prediction behavior as they occur, with slice-by-slice metrics, is the more generally applicable one — and it is `M1`.

The same reasoning explains why the paper recommends running exhaustive leave-one-feature-out evaluations regularly: features stop earning their place, and an underutilized dependency makes the system "unnecessarily vulnerable to change, sometimes catastrophically so, even though they could be removed with no detriment". Their illustration is the one to remember — an old product-numbering scheme kept as a feature alongside the new one, still relied on for some products, until a year later someone deletes the code that populates the old numbers. "This will not be a good day for the maintainers of the ML system."

**Backing.** `source` — Sculley et al., "Hidden Technical Debt in Machine Learning Systems", section 2 (Entanglement / CACE) and section 3 (Underutilized Data Dependencies), https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf ; Amershi et al., "Software Engineering for Machine Learning: A Case Study", ICSE 2019, which reports that AI components "are more difficult to handle as distinct modules than traditional software components — models may be 'entangled' in complex ways and experience non-monotonic error behavior", https://www.microsoft.com/en-us/research/uploads/prod/2019/03/amershi-icse-2019_Software_Engineering_for_Machine_Learning.pdf

---

### M9. A model that shapes its own training data needs a deliberate break in the loop

**What it requires.** When the model's predictions influence what is observed, logged, or labeled, either introduce randomization, record the position or exposure that caused the observation, or accept and document that the training data is biased by the model that produced it.

**When it applies.** Recommendation, ranking, routing, prioritization, and any classifier whose positive predictions determine what gets reviewed by a human and therefore what gets labeled. Observable when the training set is built from logged outcomes of the model's own decisions.

**Why it bites.** Chip Huyen defines a degenerate feedback loop as one "created when a system's outputs are used to create or process the same system's inputs, which, in turn, influence the system's future outputs". Her example makes the mechanism visible: two songs A and B are initially near-identical in rank, A is ranked marginally higher, A gets shown first, A gets clicked more, the system ranks A higher still. Nothing is broken. Quality metrics may even improve. The system's output homogenizes and its estimate of B's quality never gets a chance to be corrected.

Breck et al. describe the same shape from the data side as scoring/serving skew (`S4`): the ninety scored-but-never-served videos have no labels and never appear in training. Sculley et al. add the harder variant, hidden feedback loops between two systems that influence each other through the world, and note they may exist between completely disjoint systems.

The published mitigations are cheap enough to ask for in review: a small randomized exploration budget so unshown items get an unbiased quality estimate, and positional features so the model can learn what part of the observed feedback was caused by exposure rather than quality.

**Backing.** `source` — Chip Huyen, "Data Distribution Shifts and Monitoring", "Degenerate Feedback Loop" and "Correcting degenerate feedback loops", https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html ; Sculley et al., section 4, "Feedback Loops", https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf ; Breck et al., "Data Validation for Machine Learning", SysML 2019, https://mlsys.org/Conferences/2019/doc/2019/167.pdf

---

## What changed

First version of this file (2026-08-16). Nothing superseded yet.

Two entries with a short shelf life:

- `M4` cites a 2023 measurement of a specific provider's models. The *finding* — that a hosted model's behavior can move materially without notice — is structural and will outlive the measurement, but the numbers should not be quoted after they stop being current. Replace with a fresher study if one exists at the next review.
- `M7` cites TensorFlow Extended's use of summary statistics as of October 2021 via Chip Huyen. Verify before repeating; that tooling has continued to evolve.

## Sources I could not open or verify

- **Lu et al., "Learning under Concept Drift: A Review"** — abstract only, not the full review. `M2` uses it only to corroborate the terminology; the operative definitions come from Chip Huyen's post, which I read in full.
- **Klaise et al., "Monitoring and explainability of models in production"** — abstract only. `M7` cites it for the position that statistical drift and outlier detection are core monitoring areas, which the abstract states directly; no specific technique from the paper is attributed.
- **Chen, Zaharia and Zou (2307.09009)** — abstract only. The figures quoted in `M4` (84% → 51% on prime/composite, the chain-of-thought explanation, the GPT-3.5 improvement) are all stated in the abstract; I did not read the full evaluation or its later revisions.
- I did not find a primary source that settles the automated-promotion versus human-promotion question in `M6` with evidence rather than advocacy. It is marked `debated` for that reason, and the recommendation is reasoned from the asymmetry of the failure cost, not from a study.
