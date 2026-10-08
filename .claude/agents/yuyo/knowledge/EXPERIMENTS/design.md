---
updated: 2026-08-16
ttl: 24 months
sources: 11
---

# Yuyo — Experiments: Design

**What this covers.** Everything that must be true *before the first user is assigned*: what gets randomized, how big the test has to be, what has to be frozen, and the two validity checks (A/A and sample ratio mismatch) that decide whether the resulting numbers may be read at all. Out of scope: reading the result once it exists (`analysis.md`) and choosing what to measure (`metrics.md`).

**Why this layer is different from the rest of Yuyo's knowledge.** A bad query returns a wrong row and something breaks. A bad experiment returns a *plausible* number, a human ships on it, and the system keeps working. The failure mode here is a confident business decision in the wrong direction with no error, no alert, and no one who finds out. Every principle below exists because a specific version of that happened at a company that runs more experiments in a week than we do in a year.

**Backing scale.** Same as the core file.

- **`source`** — paper, standard, or official documentation cited with a URL.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both named, one recommended, with the tradeoff.

---

## 1. The randomization unit

### Randomize on the same unit you will analyze, or use a variance estimator that knows they differ

**What it requires.** The thing the assignment hash is computed over (user, account, `client_id`) must be the same thing the metric averages over. If they differ — assign by user, average over messages — the standard error is no longer the textbook one and must be computed with a method that accounts for the correlation inside a unit: the delta method or a bootstrap that resamples the *randomization* unit.

**When it applies.** Two lines of code far apart. First, the assignment: `hash(conversation_id) % 100 < 50`, or a feature flag keyed by session. Second, the metric: `AVG(x)` or `SUM(a)/COUNT(b)` where the row is a message, a ticket, or a page view. Whenever the key in the first is not the key in the second, this principle fires. In our schema the giveaway is a metric grouped by `ai_contact_id` or `ticket_v2.id` under a flag that was rolled out per `client_id`.

**Why it bites.** Observations inside one unit are correlated — one chatty account contributes forty messages that are far from independent draws. Treating them as independent shrinks the standard error, so the confidence interval is too narrow and the p-value is too small. You get statistically significant wins out of pure noise, systematically, on exactly the metrics with the most rows. Nobody notices because the analysis code is correct-looking SQL and the result is the one that was hoped for.

**Backing.** `source` — Deng, Lu and Litz, *Trustworthy Analysis of Online A/B Tests: Pitfalls, challenges and solutions*, WSDM 2017 — https://alexdeng.github.io/public/files/WSDM2017draft.pdf: "Observations Yi can be correlated, and, depending on the randomization mechanism, observations from treatment and control can also be correlated, rendering the problem of variance estimation challenging." The paper gives a general variance formula (delta method, asymptotic variance) for the case where the analysis unit is not the randomization unit, and explicitly notes that bootstrapping does not rescue you either: "the bootstrap method does not circumnavigate the fundamental i.i.d. assumption because it relies on assuming that the unit sampled with replacement is i.i.d." Corroborating and older: Crook, Frasca, Kohavi and Longbotham, *Seven Pitfalls to Avoid when Running Controlled Experiments on the Web*, KDD 2009 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf, Pitfall 3 ("Using standard statistical computations of variance and power"): "We now routinely use the bootstrap method to estimate variances whenever the experimental unit used in the calculation of the metric is different from the one used in the random assignment to the variants."

---

### Randomize at the level that contains the spillover

**What it requires.** If the treatment changes something two units share — a per-account configuration, a shared cache, a shared queue, a prompt that both sides of a conversation see — the randomization unit must be the shared thing, not the smaller one. Otherwise control is contaminated by treatment and the measured difference understates (or inverts) the real one.

**When it applies.** Observable in code as an assignment key strictly finer than the scope of the write the treatment performs. Concretely: assigning per conversation while the treatment mutates a row on the account; assigning per user while the treatment retrains a model that serves everyone; assigning per request while the treatment warms a cache. Also fires when one human sits on both sides — an agent handling both treated and untreated tickets.

**Why it bites.** Interference makes the control group partially treated, so the estimated effect is biased toward zero. A real win looks flat and gets killed; a real regression looks tolerable and ships. Worse, interference frequently shows up first as a *sample ratio mismatch*, which teams then "fix" by patching the counting logic instead of the design.

**Backing.** `source` — Fabijan, Gupchup, Gupta, Omhover, Qin, Vermeer and Dmitriev, *Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners*, KDD 2019 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf. Their taxonomy carries a dedicated category, §5.5 "Experiment Interference SRMs", alongside assignment, execution, log-processing and analysis SRMs — interference is common enough at Microsoft scale to warrant its own branch. Corroborating: Chen, Liu and Xu (LinkedIn), *Automatic Detection and Diagnosis of Biased Online Experiments*, arXiv:1808.00114 — https://arxiv.org/pdf/1808.00114, which lists "design-imposed bias" and "self-selection bias" among the four root causes they built automatic detectors for.

---

### Treat the trigger condition as part of the randomization design

**What it requires.** If only a subset of assigned users actually encounters the change, the analysis must be restricted to the *triggered* population on both arms, and the trigger condition must be evaluable identically in control — where the feature does not exist. Diluting over everyone is valid but weak; comparing triggered-treatment against all-control is invalid.

**When it applies.** A feature flag guarded by a second condition: `if (flag && contact.has_orders)`. The trigger (`has_orders`) is computable in control, so counterfactual triggering is possible — that is the good case. The bad case is a trigger that only exists inside the treatment code path (`if (flag && newModelReturnedASuggestion)`), which cannot be evaluated for control users at all.

**Why it bites.** Comparing a self-selected slice of treatment to the whole of control compares two different populations; the "effect" is mostly the selection. This is the classic self-selection bias and it survives every correctness test, because the counts are real and the SQL is right. It also produces a sample ratio mismatch when the trigger fires at different rates by arm, which is your only external warning.

**Backing.** `source` — Chen, Liu and Xu, arXiv:1808.00114 — https://arxiv.org/pdf/1808.00114 (self-selection bias and "trigger-day effect" are two of the four biases LinkedIn automated detection for). Corroborating: Deng, Xu, Kohavi and Walker, *Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data* (CUPED), WSDM 2013 — https://exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf, which frames the same requirement from the covariate side: any adjustment variable must be "established before a user actually triggers the experiment feature", and notes this "can be particularly helpful if the feature to be evaluated has a low triggering rate."

---

## 2. Size and duration, decided in advance

### Compute the sample size before launch and write the minimum detectable effect down

**What it requires.** Before the flag is turned on, three numbers exist in the ticket or the PR description: the baseline rate, the smallest effect worth shipping for, and the resulting sample size per arm. The standard two-sample formula at 80% power and α = 0.05 is n = 16σ²/δ² per variant.

**When it applies.** Any experiment config, feature-flag rollout, or `is_variant_b`-style column merged with no recorded target sample or target duration. Also fires on the softer version: an analysis notebook that reports a delta and a p-value but never states what effect the test *could* have found.

**Why it bites.** Underpowered tests do not fail loudly; they return "no significant difference" and the team concludes the idea does not work. Kohavi, Deng and Vermeer walk a real published A/B test whose author claimed a result from roughly 80 users per variant: with a 3.7% baseline conversion and a 10% relative target effect, the correct size is 41,642 per variant, and the actual power at 80 users was **3%**. A test with 3% power is a coin flip wearing a lab coat, and its output was published as a lesson for other practitioners.

**Backing.** `source` — Kohavi, Deng and Vermeer, *A/B Testing Intuition Busters: Common Misunderstandings in Online Controlled Experiments*, KDD 2022 (DOI 10.1145/3534678.3539160) — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf: "n = 2σ²(Z₁₋β + Z₁₋α/2)²/δ² … For 80% power … the numerator is 15.68σ², conservatively rounded to 16", giving "16σ²/δ² = 16 * 3.563%/(0.37%)² = 41,642", against a test "run with about 80 users per variant, and thus grossly underpowered even for detecting a large 10% change."

---

### Never compute power after the fact to defend a flat result

**What it requires.** Power is a design-time quantity. Once the data is in, the honest statement about a non-significant result is the confidence interval, not an "observed power" recomputed from the effect you happened to measure.

**When it applies.** A review comment or analysis note saying "we had enough traffic", "post-hoc power was 85%", or a helper function that plugs the *observed* delta back into a power formula. Any `statsmodels`/`scipy` power call whose effect-size argument is the measured effect rather than a pre-registered one.

**Why it bites.** Observed power is a deterministic re-expression of the p-value, so it adds no information and inherits all of the p-value's variance. In a low-power test it is enormously noisy, and it is used precisely in the situation where it misleads most: to convert "we found nothing" into "we proved there is nothing", which then justifies killing a feature that was never measurable.

**Backing.** `source` — Kohavi, Deng and Vermeer, KDD 2022 — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf: the bounding claim for a non-significant result "holds true for pre-experiment power calculations, but it fails spectacularly for post-hoc, or observed power, calculations." They quote Hoenig and Heisey (2001), *The Abuse of Power: The Pervasive Fallacy of Power Calculations for Data Analysis*, on the "power approach paradox", Gelman (2019) that "using observed estimates of effect size is too noisy to be useful", and Greenland (2012) that post-hoc power "is analogous to giving odds on a horse race after seeing the outcome" and "is unsalvageable as an analytic tool".

---

### Run at least one full weekly cycle, and do not extrapolate the first days

**What it requires.** The experiment covers whole weeks, not "until it looks good". A delta-over-time chart is read for stability, never for slope.

**When it applies.** A rollout that starts Tuesday and is decided Thursday. Or an analysis whose chart shows the treatment effect climbing over the first four days and whose conclusion draws that line forward.

**Why it bites.** Two separate mechanisms both produce a fake trend in the first days. Weekday and weekend populations differ, so a partial week measures a different mix than the one you will ship to. And early deltas regress to the mean simply because the confidence interval starts wide and shrinks — Kohavi et al. show a chart with a strong four-day positive trend that is an **A/A test**, where the true effect is zero by construction. The experimenter's instinct is to attribute the trend to primacy ("users need time to adapt") and to project it. That reasoning ships losing features.

**Backing.** `source` — Kohavi, Deng, Frasca, Longbotham, Walker and Xu, *Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained*, KDD 2012 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf, §3.3: "The graph in Figure 3 actually is from an A/A test (no difference between the control and treatment) where we know the mean of the effect is zero. The first day had a negative delta … and as more days go by and the confidence interval shrinks, the results regress to the mean." Their mitigation: "an analysis can be done where the OEC is computed only for new users on the different variants, since they are not affected by Primacy and Novelty. Another option is to exclude the first week." Corroborating on duration: Kohavi, Deng, Frasca, Walker, Xu and Pohlmann, *Online Controlled Experiments at Large Scale*, KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf, which discusses OEC metrics "measurable in the short-term" over "durations (e.g., two weeks)".

---

### Do not assume running longer buys power

**What it requires.** Before extending a test to "reach significance", check whether the metric's confidence interval actually narrows with time. For cumulative per-user metrics it often does not.

**When it applies.** The decision to extend an experiment past its planned end because the ship metric is close to the threshold. Observable in a config change that only moves an end date, with no re-derived sample size.

**Why it bites.** The width of the confidence interval on a *percent* change depends on the coefficient of variation and the sample size together. For metrics like sessions per user, the mean and the standard deviation both grow as the experiment runs, so the ratio stays roughly flat and the interval does not shrink. Extending the test then costs weeks and buys nothing — while simultaneously being a second peek at the data, which does inflate the false positive rate. You pay in both currencies.

**Backing.** `source` — Kohavi et al., KDD 2012 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf, §3.4: "For some of our key metrics, including Sessions/user, the confidence interval of the percent effect does not shrink over time. Running the experiment longer does not provide additional statistical power for these metrics." Their Figure 7 shows CV/√n roughly constant (under 10% change) across a 31-day period.

---

## 3. Freeze, then launch

### Freeze the decision rule before the first assignment

**What it requires.** Metric list, primary metric, segments, exclusion filters, and the stop date exist in writing before traffic flows. Adding any of them afterwards converts the analysis from a test into a search.

**When it applies.** Compare the commit date of the analysis query against the experiment start date. A segment, an outlier filter, or an extra metric introduced after launch is the observable trigger. In review: a PR that adds `AND channel = 'whatsapp'` to a running experiment's dashboard.

**Why it bites.** Fixed-horizon p-values are only valid when the design and the analysis are separated. Every post-hoc choice — whether to collect more data, whether to drop outliers, which segment to report — is an extra degree of freedom, and each one raises the chance of finding a "significant" result in noise. The result is not one false positive; it is a process that reliably manufactures them, and the report reads exactly like a report of a real finding.

**Backing.** `source` — Johari, Koomen, Pekelis and Walsh, *Peeking at A/B Tests: Why it matters, and what to do about it*, KDD 2017 — http://library.usc.edu.ph/ACM/KKD%202017/pdfs/p1517.pdf: "the inferential validity of these p-values and confidence intervals requires the separation between the design and analysis of experiments to be strictly maintained. In particular, the sample size must be fixed in advance." Corroborating: Kohavi, Deng and Vermeer, KDD 2022 — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf, citing Simmons, Nelson and Simonsohn (2011) on researcher degrees of freedom — "Should more data be collected, or should we stop now? Should some observations be excluded (e.g., outliers, bots)? Segmentation by variables (e.g., gender, age, geography) and reporting just those as statistically significant" — and their verdict that "it is unacceptably easy to publish 'statistically significant' evidence consistent with any hypothesis."

---

### Run an A/A test against the real pipeline whenever the plumbing changes

**What it requires.** A new assignment service, a new bucketing hash, a new logging path, or a new metric gets an A/A test — both arms identical — through the *production* analysis pipeline before it is trusted to carry an A/B decision. About 5% of A/A metrics should come out "significant"; materially more or materially fewer is a bug.

**When it applies.** A diff touching the hash function, the bucket count, the salt, the exposure-logging call, or the metric SQL. Also: a pre-period check on a live experiment — computing the same metrics for the window *before* the treatment started, where the true delta is zero by construction.

**Why it bites.** Assignment and logging bugs are invisible to unit tests because the tests assert on the code, not on the distribution the code produces in aggregate. Fabijan et al. describe an A/A test on MSN.com that itself showed a sample ratio mismatch; the root cause was a bug in the assignment service's mapping of users to its thousand hash buckets. Without the A/A, that bug would have silently biased every experiment routed through the service, and every one of those experiments would have produced a clean-looking scorecard.

**Backing.** `source` — Fabijan et al., KDD 2019 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf, §5.1: "For every A/B test, it is a best practice to compute results for the pre-period before the test started and confirm that a random split of users into two groups does not cause a large difference in key metrics. If it does, then the same metric in the A/B test period would carry over some of that bias." Corroborating: Crook et al., KDD 2009 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf, §8.2–8.3, which prescribe both online and offline A/A tests as standard trust-building instrumentation, and note that their audits "found serious problems with the Microsoft 'system of record'."

---

### Sample ratio mismatch is the gate: if it fires, do not read the metrics at all

**What it requires.** Before any delta is computed, the observed unit counts per arm are compared against the configured split with a chi-square test. If the test fires, the scorecard is not "suspicious" — it is void, and the only allowed next action is root-causing the mismatch.

**When it applies.** Any experiment scorecard, notebook, or dashboard query that reports treatment-vs-control deltas without a preceding count check. In review, the observable is the absence of a `COUNT(DISTINCT unit) GROUP BY variant` sanity step, or its presence as an eyeballed ratio ("50.3% vs 49.7%, close enough") rather than a test — the raw ratio carries no information without the sample size.

**Why it bites.** An SRM means the two groups were not formed by the randomization you think happened, so the difference between them is a mix of the treatment and whatever selection produced the imbalance. There is no way to separate them after the fact, and the imbalance is frequently *caused* by the treatment (a slower variant loses more users to abandonment, so the survivors are the more patient ones — who also convert better). The metric then moves in a direction that is entirely selection, is statistically significant, and matches the team's hypothesis.

**Backing.** `source` — Fabijan et al., KDD 2019 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf: "approximately 6% of experiments at Microsoft exhibit an SRM … a product running ten thousand experiments in a year can expect to see at least one SRM per day"; and §4.2: "SRMs cause a selection bias that invalidates any causal inference that could be drawn from the experiment", with the practitioner quote "The SRM is critical. The analysis is completely untrustworthy." On the mechanics and the threshold: Microsoft Research, *Diagnosing Sample Ratio Mismatch in A/B Testing* — https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/: "Contrary to intuition, it is not sufficient to glance only at the ratio of users in A vs. B. The ratio lacks information about the sample size. We need to use a statistical test such as a chi-square statistic … The threshold that we use is conservative to reduce the likelihood of false positives: p-value < 0.0005."

---

### Do not reuse buckets across consecutive experiments without re-randomizing

**What it requires.** When assignment comes from a reusable bucket pool, the buckets that carried the previous experiment must be re-shuffled (or given a fresh salt) before they carry the next one. A pre-period A/A on the new split confirms it worked.

**When it applies.** An assignment scheme where the hash maps to a stable bucket id and experiments are configured as "buckets 0–99" — the same population, in the same order, experiment after experiment. Observable as a config that names bucket ranges rather than a per-experiment salt.

**Why it bites.** Users carry the residue of the previous treatment into the next one: learned behaviour, a changed setting, a different retention profile. The follow-on experiment then shows large, highly significant movements on metrics that have nothing to do with the change under test. Kohavi et al. describe exactly this — surprising, strongly significant effects on unrelated metrics that vanished when the experiment was rerun on a larger, fresh sample. The failure signature is "the result is amazing and slightly weird", which is the signature people are least likely to investigate.

**Backing.** `source` — Kohavi et al., KDD 2012 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf, §3.5: "One big drawback with the 'bucket system' is its vulnerability to carryover effects, where the same users who were impacted by the first experiment are being used for the follow-on experiment. This is known, and A/A tests can be run to [detect it]." Their reported case: "metrics unrelated to the change moved in unexpected directions and the effects were highly statistically significant. We reran the experiment on a larger sample … and many of the effects disappeared."

---

## What changed

- **"Run it longer if you need more power" is no longer a safe default.** It was standard advice while experiments were treated as fixed-horizon tests you could simply lengthen. Two results retired it: Kohavi et al. (KDD 2012, §3.4) showed the percent-change interval does not narrow with time for cumulative per-user metrics, and the peeking literature showed that deciding *to extend* after seeing the result is itself a peek. Extending is now a design decision that must be made before launch, or handled with a sequential method (see `analysis.md`).
- **Post-hoc / observed power moved from "reasonable sanity check" to "do not do this".** Hoenig and Heisey (2001) named the paradox; Kohavi, Deng and Vermeer (KDD 2022) carry it into the online-experiment setting. Older A/B tooling and blog posts still surface an "observed power" field. Treat its presence as a finding, not a feature.
- **A/A testing has shifted from a one-time platform validation to a per-change check.** The 2009 framing was "prove the platform works once". The 2019 SRM taxonomy shows assignment bugs are recurrent and product-specific, so the current practice is a pre-period A/A on every experiment, run automatically.

## Sources I could not open or verify

- Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing* (Cambridge University Press, 2020) — the book is the canonical reference for this whole layer, but it is not publicly readable. Only the publisher/author landing page was opened: https://experimentguide.com/. No claim above is sourced to the book text; every claim traces to a paper whose PDF was opened and quoted.
- Hoenig and Heisey (2001), Gelman (2019), Greenland (2012), Simmons/Nelson/Simonsohn (2011): quoted **as quoted inside** the KDD 2022 paper, whose PDF was opened. The originals were not fetched.
