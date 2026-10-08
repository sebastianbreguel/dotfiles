---
updated: 2026-08-16
ttl: 24 months
sources: 29
---

# Yuyo — Experiments: Analysis

**What this covers.** Reading a result that already exists: when you are allowed to look, how many things you are allowed to look at, what to report instead of a bare p-value, and which "wins" are almost certainly bugs. Out of scope: what to randomize and how big the test must be (`design.md`), and what the numbers should measure in the first place (`metrics.md`).

**The failure mode.** Nothing here crashes. A peeked-at experiment, a segment discovered after the fact, or a p = 0.04 shipped without replication all produce a scorecard that is indistinguishable from a real finding. The system stays up, the roadmap turns, and the cost shows up months later as a feature nobody can explain the value of. Treat every principle below as protecting a decision, not a process.

**Backing scale.** Same as the core file.

- **`source`** — paper, standard, or official documentation cited with a URL.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both named, one recommended, with the tradeoff.

---

## 1. When you are allowed to look

### Do not stop an experiment because you saw significance

**What it requires.** With a classical fixed-horizon test, the result may be read once, at the pre-declared sample size or end date. Checking daily and stopping at the first p < 0.05 is not "being efficient"; it is a different statistical procedure with a much higher error rate than the one the p-value describes.

**When it applies.** Any live dashboard that recomputes a p-value on a running experiment, plus a human or an automation with the authority to stop. In code: a scheduled job that reads a running experiment's scorecard and posts to Slack; a `while` loop that recomputes `ttest_ind` as data accrues; a "stop early if significant" branch. The trigger is not the looking — it is the looking *combined with* the power to act.

**Why it bites.** Every extra look is an extra chance to cross the threshold by luck, and under the null the p-value path wanders. Johari et al. measured the damage at realistic sizes: at 10,000 samples per arm — routine online — "the false positive probability can easily be inflated by 5-10x". Netflix reproduced it more starkly in an A/A simulation, where by construction there is no effect at all. So the observed practice — watch the dashboard, ship when it turns green — has a false-positive rate closer to a coin flip than to 5%, and produces a steady stream of confidently wrong ship decisions that all look like the 5%-risk decisions they were budgeted as.

**Backing.** `source` — Johari, Koomen, Pekelis and Walsh, *Peeking at A/B Tests: Why it matters, and what to do about it*, KDD 2017 — http://library.usc.edu.ph/ACM/KKD%202017/pdfs/p1517.pdf: "even with 10,000 samples (quite common in online A/B testing), we find that the false positive probability can easily be inflated by 5-10x. That means that, throughout the industry, users have been drawing inferences that are not supported by their data." Corroborating with a fresh simulation: Netflix Technology Blog, *Sequential A/B Testing Keeps the World Streaming Netflix, Part 1: Continuous Data* (12 Feb 2024) — https://netflixtechblog.com/sequential-a-b-testing-keeps-the-world-streaming-netflix-part-1-continuous-data-cba6c7ed49df: repeatedly applying a Mann-Whitney test as 10,000 observations accrue in simulated A/A tests, "an alarming 70% of simulations declare a significant difference at some point in time, even though, by construction, there is no difference" (their figure caption reports 66 of 100 paths falsely rejecting). Practitioner framing: Dmitriev, Gupta, Kim and Vaz, *A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments*, KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf, §5.6, answering both "can we stop early because it's already significant?" and "can we keep going until it becomes significant?" with "no".

---

### If anyone can act mid-flight, use always-valid inference instead of forbidding the look

**What it requires.** When continuous monitoring is a product requirement — a kill switch, a regression detector, a stakeholder with dashboard access — do not rely on policy to stop people looking. Change the statistics: use an always-valid p-value or a confidence sequence, which hold their guarantee at every sample size simultaneously, so stopping at any moment is legitimate.

**When it applies.** An experiment framework exposing a live "significant?" flag; an automated rollback that triggers on a metric regression; an internal tool where anyone can open a running test. Also fires in reverse: an analysis that hand-rolls `scipy.stats.ttest_ind` inside a monitoring loop.

**Why it bites.** The fixed-horizon rule ("look once") is unenforceable in a company where the dashboard exists. Forbidding the look loses the real benefit of real-time data — catching a bad ship in hours instead of two weeks — and is ignored in practice anyway, which is worse than not having the rule. The methods that fix this properly are mature and in production at large platforms; hand-rolling a t-test and asking people to be disciplined is the option that quietly fails.

**Backing.** `source + debated` — Johari, Pekelis and Walsh, *Always Valid Inference: Continuous Monitoring of A/B Tests*, arXiv:1512.04922 (v3, 16 Jul 2019; published in *Operations Research* 70(3)) — https://arxiv.org/pdf/1512.04922: they define always-valid p-values that "control Type I error, no matter when the user chooses to stop the test", constructed from a mixture sequential probability ratio test (mSPRT), and report deployment in a large commercial A/B platform. Modern nonparametric counterpart: Waudby-Smith, Arbour, Sinha, Kennedy and Ramdas, *Time-uniform central limit theory and asymptotic confidence sequences*, arXiv:2103.06476 (v9, 14 Mar 2024) — https://arxiv.org/pdf/2103.06476. Production evidence: Netflix TechBlog, Feb 2024 — https://netflixtechblog.com/sequential-a-b-testing-keeps-the-world-streaming-netflix-part-1-continuous-data-cba6c7ed49df, noting the lineage back to Wald's *Sequential Tests of Statistical Hypotheses* (1945).
- *Position A (sequential / always-valid):* let people look whenever they want; the method absorbs it. Cost: at any given sample size the sequential interval is wider than the fixed-horizon one, so you pay in sensitivity for the option to stop.
- *Position B (fixed-horizon, locked stop date):* keep the tighter interval and enforce a single read. Cost: enforcement is social, not technical, and it forfeits early stopping on genuinely harmful treatments.
- **Recommendation:** sequential whenever a human or an automation can act on the running result — which is almost always in an internal tool. Fixed-horizon only when the read is genuinely batch (a scheduled analysis nobody can see early). **Tradeoff:** a wider interval, in exchange for every mid-flight look being legitimate instead of silently corrosive.

---

## 2. How many things you looked at

### Count every comparison you actually made, not the one you report

**What it requires.** The number of hypotheses tested is metrics × variants × segments × time windows, not one. If that number is greater than a handful, α = 0.05 per cell is the wrong threshold and must be adjusted, or the finding must be labelled exploratory.

**When it applies.** A scorecard query that emits a p-value per metric per segment. A notebook cell that loops over segments and prints the significant ones. A review comment reporting "significant for Chile" from an analysis that also ran Mexico, Colombia, Peru and Brazil. Observable in code as a `for` loop around a test, or a `GROUP BY` whose cardinality multiplies the comparisons.

**Why it bites.** At scale this is not a rounding error. LinkedIn reports that the number of metrics generated per experiment "has more than quadrupled (from 1000 to 4500)" — at 4,500 metrics and α = 0.05, roughly 225 metrics move "significantly" in a pure A/A test. The person reading the scorecard sees the two that support the hypothesis and does not see the 223 that were also drawn. This is the mechanism that lets a reviewer, acting in good faith and with no p-hacking intent, walk out of a flat experiment with a shippable story.

**Backing.** `source + debated` — scale of the problem: Chen, Liu and Xu (LinkedIn), *Automatic Detection and Diagnosis of Biased Online Experiments*, arXiv:1808.00114 — https://arxiv.org/pdf/1808.00114 ("the number of metrics generated for each experiment has more than quadrupled (from 1000 to 4500)"). Mechanism: Kohavi, Deng and Vermeer, *A/B Testing Intuition Busters*, KDD 2022 — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf, on researcher degrees of freedom and Gelman and Loken's "garden of forking paths": "Even without intentional p-hacking, researchers make multiple choices that lead to a multiple-comparison problem and inflate type-I errors." Industrial practice: Kohavi et al., *Online Controlled Experiments at Large Scale*, KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf, §5.1: "We look for lower p-values for projects that have multiple treatments and/or iterations … there should be a 'final' run, preferably with higher statistical power, which determines the final results."
- *Position A (control the family-wise error rate — Bonferroni/Holm):* guarantees that the probability of *any* false positive stays at α. Appropriate for the single metric a ship decision hangs on. Cost: with hundreds of metrics it is so conservative that nothing is ever significant, so people stop applying it.
- *Position B (control the false discovery rate — Benjamini-Hochberg, 1995):* controls the expected *proportion* of reported discoveries that are false, FDR = FP/(FP+TP) — see https://en.wikipedia.org/wiki/False_discovery_rate. Much more powerful on wide scorecards. Cost: it accepts that some fraction of what you report is wrong, which is only acceptable if the reports are triage, not decisions.
- **Recommendation:** FDR across the wide scorecard (it is a screening surface), FWER-strict or an untouched pre-registered α on the one primary metric that determines ship/no-ship. **Tradeoff:** you accept a known false-discovery rate among the secondary signals in exchange for those signals remaining usable at all.

---

### Segment findings are hypotheses, not results

**What it requires.** A subgroup effect discovered in the same data that produced it is a candidate for a new experiment, never a conclusion. If you want to act on a segment, pre-register the segment or rerun the test within it.

**When it applies.** Any claim of the form "it worked for X" where X was not in the frozen plan. In code: a `WHERE segment = ...` added to an analysis after launch, or a heterogeneity scan across device, country or plan.

**Why it bites.** Beyond the multiplicity, segments are internally treacherous. Dmitriev et al. report a Bing experiment where users who saw a "deeplink" and users who did not *both* showed a statistically significant increase in sessions per user — while the combination of the two showed no significant change at all. The segment membership was itself affected by the treatment, so the two slices are not a partition of a fixed population. A reviewer who sees two green segments and reports "it wins everywhere" has read the data exactly backwards.

**Backing.** `source` — Dmitriev, Gupta, Kim and Vaz, KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf, §5.8: "Both groups of users, those who saw a deeplink (U1) and those who did not (U2), showed a statistically significant increase in Sessions per User, the key Bing metric. However, the combination (U1 + U2) did not show a statistically significant change in the metric." They allow segmentation "for debugging … and for detecting other types of heterogeneous treatment effects" but require that "one needs to interpret metric movements on segments with care."

---

## 3. What to report

### Report the interval and the effect size, not the verdict

**What it requires.** The output of an analysis is a point estimate with a confidence interval, in the units the business cares about, plus a statement of what would be worth shipping. A boolean `significant` field is not a result.

**When it applies.** An analysis function returning `{ p_value, significant }`. A dashboard cell that renders a green check. A PR description that says "statistically significant improvement" with no number attached.

**Why it bites.** Significance and importance are unrelated quantities. A large test makes a 0.05% lift significant; that lift may not pay for the code that produced it. Conversely a wide interval that happens to exclude zero can be consistent with effects from "trivial" to "enormous", and shipping on the point estimate silently assumes the top of that range. The decision that gets made wrong here is a resourcing decision — teams keep investing in a direction whose real effect size was never stated.

**Backing.** `source` — American Statistical Association, *Statement on Statistical Significance and P-Values* (7 March 2016) — https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf. Principle 3: "Scientific conclusions and business or policy decisions should not be based only on whether a p-value passes a specific threshold." Principle 5: "A p-value, or statistical significance, does not measure the size of an effect or the importance of a result." Principle 2: p-values "do not measure the probability that the studied hypothesis is true, or the probability that the data were produced by random chance alone." The statement recommends approaches "that emphasize estimation over testing such as confidence, credibility, or prediction intervals".

---

### "Not statistically significant" is not "no effect" — state what the test could have detected

**What it requires.** A flat result must be reported together with its confidence interval or its minimum detectable effect. "No impact on revenue" is only a valid sentence if the interval excludes an impact worth caring about.

**When it applies.** A conclusion of "no change", "no regression", or "safe to ship" on a metric that was not the primary one. Observable in an analysis that reports p > 0.05 and moves on without printing the interval.

**Why it bites.** Guardrail metrics are usually the underpowered ones, so this failure lands precisely where it is most expensive: a treatment that genuinely degrades a secondary metric ships because the test could never have seen it. Dmitriev et al. give the arithmetic — an MSN.com experiment where total page views per user moved 0.5% with p > 0.05; the confidence interval spanned about ±5%, and only a change of 7.8% or larger was detectable at 80% power. A 0.5% move in page views is "often interpreted as a meaningful impact on the business", and the experiment was structurally blind to ten times that.

**Backing.** `source` — Dmitriev et al., KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf, §5.4: "the confidence interval of the metric lied over about ±5% and the experiment was not configured to have an enough power for the metric; it turned out that only 7.8% or larger change could be detected with 80% power … Therefore, we cannot assume that we did not impact the underpowered metric." Consistent with ASA Principle 3 — https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf.

---

### Replicate a borderline win before you ship it

**What it requires.** A p-value near the threshold on the ship metric buys a rerun, not a launch. The rerun is an independent execution, ideally at higher power.

**When it applies.** p between roughly 0.01 and 0.05 on the primary metric, especially on a metric that rarely moves. Also: the first positive result after several flat iterations of the same idea — the sequence itself is a multiplicity problem.

**Why it bites.** The posterior probability that a borderline-significant result is real depends on the prior, and in a well-optimized product the prior against a real win is strong. Dmitriev et al. describe a Bing experiment with p = 0.029 on a key satisfaction metric — a metric "very few experiments succeed in improving". They reran it with double the traffic: no statistically significant change at all. Without the replication step, that becomes a shipped feature and a case study in a deck.

**Backing.** `source` — Dmitriev et al., KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf, §5.5: "whenever key metrics move in a positive direction we always run a certification flight which tries to replicate the results of the experiment by performing an independent run of the same experiment. In the above case, we reran the experiment with double the amount of traffic and observed that there were no statistically significant changes for the same metric." Corroborating: Kohavi, Deng, Longbotham and Xu, *Seven Rules of Thumb for Web Site Experimenters*, KDD 2014 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf, Rule #2: "Results with borderline statistically significant results should be viewed as tentative and rerun to replicate the results." And Kohavi et al., KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf, §5.1, which institutionalises replication as the "final check to avoid false positives and get a more accurate (unbiased) estimate of the effect size."

---

## 4. Results that are too good, and results that trend

### Twyman's law: an unusually large effect is evidence of a bug, not of success

**What it requires.** Compare the measured effect against the historical distribution of effects for that metric. If it is several standard deviations out, the first hypothesis is an instrumentation, logging, or filtering error — and the burden of proof sits on the result, not on the skeptic.

**When it applies.** A reported lift far outside the usual range: a double-digit relative move on a core metric, a metric that has never moved suddenly moving, or an effect that appears on metrics the change should not touch. Also fires when the *direction* is surprising in a convenient way.

**Why it bites.** Human review is asymmetric: negative results get drilled into, positive results get celebrated. So bugs that produce wins survive review at a much higher rate than bugs that produce losses, and the surviving population of "big wins" is enriched for instrumentation errors. Kohavi et al. make the Bayes arithmetic explicit: with Sessions/user effects distributed roughly normal around 0 with a standard deviation of 0.25%, a claimed +2.0% is eight standard deviations out, prior probability on the order of 1e-15 — so even a statistically significant +2.0% is far more likely to be a bug than a breakthrough.

**Backing.** `source` — Kohavi, Deng, Longbotham and Xu, KDD 2014 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf: "We are inclined to resist and question negative results to our great new feature that is being tried, so we drill deeper to find the cause. However, when the effect is positive, the inclination is to celebrate rather than drill deeper and look for anomalies. When results are exceptionally strong, we learned to call out Twyman's law: Any figure that looks interesting or different is usually wrong!" Definition and provenance: https://en.wikipedia.org/wiki/Twyman%27s_law. Institutionalised as a review step in Kohavi et al., KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf, §3.5.

---

### Separate novelty and primacy from the steady-state effect before extrapolating

**What it requires.** If the delta moves over the days of the experiment, do not project the line. Either re-estimate on users who joined the experiment late (they cannot have a primacy effect), or discard the first week and read the stable region, or extend the test — but do not read the slope as a forecast.

**When it applies.** A delta-over-time chart used as an argument. A review comment of the form "it's negative now but the trend is clearly improving as users adapt". In code: an analysis that fits a line to daily deltas.

**Why it bites.** The trend usually is not a behavioural adaptation at all; it is regression to the mean as the confidence interval narrows, which happens in A/A tests where the true effect is exactly zero. Because primacy and novelty are real phenomena with real names, the wrong explanation is always available and always sounds sophisticated. Both of the resulting errors are expensive: extrapolating a rising line ships a loser, and dismissing a falling one as "just novelty" ships a feature whose lift evaporates after launch.

**Backing.** `source` — Kohavi, Deng, Frasca, Longbotham, Walker and Xu, *Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained*, KDD 2012 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf, §3.3: the illustrated four-day "improving trend" is from an A/A test; "The existence of Primacy and Novelty effects can be assessed by generating the delta graph (between Control and Treatment) over time, and evaluating trends, visually or analytically. If we suspect such a trend, we can extend the experiment. To evaluate the true effect, an analysis can be done where the OEC is computed only for new users on the different variants, since they are not affected by Primacy and Novelty." Corroborating: Dmitriev et al., KDD 2017, §5.10 (https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf), and Chen, Liu and Xu, arXiv:1808.00114 — https://arxiv.org/pdf/1808.00114, who built an automatic novelty-effect detector because the manual judgement was unreliable.

---

### Start from the prior that the change did nothing

**What it requires.** The default posture in reviewing an experiment analysis is that most ideas do not move the metric they were built to move, and the ones that do move it a little. A reported win must clear that prior, not merely clear p = 0.05.

**When it applies.** Any review of an experiment write-up. It is a posture, not a code pattern — but it becomes concrete when the write-up's language ("as expected, the new flow improved conversion") assumes the win and uses the statistics as confirmation.

**Why it bites.** If most tested ideas are null, then at α = 0.05 a meaningful share of all "significant" results are false positives, regardless of how carefully each individual test was run. Teams that do not internalise the base rate treat every green scorecard as a discovery, accumulate a portfolio of features whose combined claimed lift wildly exceeds the product's actual growth, and lose the ability to tell which of their bets actually worked. That is the compounding version of the failure this whole layer exists to prevent.

**Backing.** `source` — Kohavi et al., *Online Controlled Experiments at Large Scale*, KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf, Tenet 3 ("We are poor at assessing the value of ideas"): "Features are built because teams believe they are useful, yet in many domains most ideas fail to improve key metrics. Only one third of the ideas tested at Microsoft improved the metric(s) they were designed to improve. Success is even harder to find in well-optimized domains like Bing." Magnitude of the winners: Kohavi et al., KDD 2014 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf, Rule #2: "for web sites like Bing, where thousands of experiments are being run annually, most fail, and those that succeed improve key metrics by 0.1% to 1.0%, once diluted to overall impact."

---

## 5. Which test, and on what assumptions

### Write H0 and H1 down, and check which null the function you called actually tests

**What it requires.** Before the test call, one sentence stating the null hypothesis and one stating the alternative, in the units of the data. Then confirm that the function chosen tests *that* null. Different tests in the same module test genuinely different statements, and the p-value only refers to the one the function implements.

**When it applies.** Any `scipy.stats.*` call, any `statsmodels` call, any SQL that computes a z-score by hand. Especially: a swap between two tests made for robustness reasons ("the data is skewed, I switched to Mann-Whitney") without restating what is now being claimed.

**Why it bites.** The nulls are not interchangeable. `ttest_ind` "is a test for the null hypothesis that 2 independent samples have identical average (expected) values". `mannwhitneyu` is "a nonparametric test of the null hypothesis that the distribution underlying sample x is the same as the distribution underlying sample y" — a statement about whole distributions, "often used as a test of difference in location". `chi2_contingency` tests "independence of variables in a contingency table". `fisher_exact` tests, for a 2x2 table, "that the true odds ratio of the populations underlying the observations is one". `f_oneway` tests "that two or more groups have the same population mean"; `kruskal` tests "that the population median of all of the groups are equal". So a significant Mann-Whitney result does not license the sentence "average revenue per user went up", which is the sentence the ship decision needs — the test never made a claim about the mean. Nobody catches this because the code runs, the p-value is small, and the write-up quietly reverts to talking about averages.

**Backing.** `source` — SciPy reference documentation, each function's own statement of its null hypothesis: `ttest_ind` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html, `mannwhitneyu` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html, `chi2_contingency` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html, `fisher_exact` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fisher_exact.html, `f_oneway` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html, `kruskal` https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kruskal.html (all quoted above). The reason the statement must be written before the data is read: American Statistical Association, *Statement on Statistical Significance and P-Values* (2016) — https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf, Principle 1: "P-values can indicate how incompatible the data are with a specified statistical model" — the model is the thing being specified, and it is specified by you.

---

### Choose the test from the shape of the outcome and the number of arms, not from habit

**What it requires.** A short routing decision, made explicitly. Two arms, continuous or count outcome per unit → two-sample t-test (Welch by default) or its large-sample z equivalent. Two arms, binary outcome summarized as counts → chi-squared test of independence on the 2x2, or Fisher's exact test when the cells are small. More than two arms → one-way ANOVA (or Kruskal-Wallis without the normality assumption), followed by a post-hoc comparison, not a scan of pairwise t-tests. A statistic that is not a mean — a median, a p95, a ratio of sums, a difference of quantiles → bootstrap.

**When it applies.** Observable directly at the call site. Red flags: `ttest_ind` on two arrays of 0/1 conversion flags aggregated per user (works, but the equivalent 2x2 test is the natural framing and reports the odds ratio); `chi2_contingency` on a table with a cell count of 3; a `for` loop of pairwise `ttest_ind` over five variants with no correction; `ttest_ind` on a list of per-request p95 latencies.

**Why it bites.** Each mismatch fails differently and none of them raise. The chi-squared approximation degrades on sparse tables — SciPy states the guideline plainly: "the test should be used only if the observed and expected frequencies in each cell are at least 5", and Fisher's exact test exists for exactly the case where that fails (SciPy's own cross-reference runs the other way: chi-squared "can be used as an alternative to `fisher_exact` when the numbers in the table are large"). Pairwise t-tests across k arms are the multiple-comparison problem from §2 wearing a different hat, and `kruskal`'s documentation flags the same requirement from the other side: "rejecting the null hypothesis does not indicate which of the groups differs. Post hoc comparisons between groups are required." And there is no closed-form t-test for a p95 at all, which is why analyses that need one either quietly report a mean instead or report a quantile with no interval — both of which change the decision.

**Backing.** `source` — the sparse-table guideline and the Fisher/chi-squared boundary: SciPy `chi2_contingency` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html and `fisher_exact` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fisher_exact.html (which also names `barnard_exact` and `boschloo_exact` as "more powerful alternative[s] than Fisher's exact test for 2x2 contingency tables"). Post-hoc requirement after an omnibus test: SciPy `kruskal` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kruskal.html. The general-purpose fallback for arbitrary statistics: SciPy `bootstrap` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html, which computes a confidence interval for any user-supplied statistic by resampling, defaulting to the bias-corrected and accelerated (`BCa`) interval rather than the naive percentile one, which it notes "is rarely used in practice". Catalogue of what else exists: SciPy, *Hypothesis tests* — https://docs.scipy.org/doc/scipy/tutorial/stats/hypothesis_tests.html.

---

### Check the assumption before you lean on it — and check the assumption that matters

**What it requires.** Parametric tests carry named assumptions, and the ones that bite are usually not the one people check. One-way ANOVA assumes, in SciPy's own words, that "the samples are independent", "each sample is from a normally distributed population", and "the population standard deviations of the groups are all equal. This property is known as homoscedasticity". `ttest_ind` "assumes that the populations have identical variances by default" — a default worth changing. Independence is the assumption to verify first, because no switch fixes it.

**When it applies.** `ttest_ind(a, b)` with the default `equal_var=True` on two arms of visibly different spread. `f_oneway` across variants of very different sizes. Any test whose input rows are not independent — multiple rows per user, per account, per conversation. In review, the observable is the absence of any variance or independence check anywhere near the test call.

**Why it bites.** Unequal variance with unequal group sizes is the classic case where the pooled-variance t-test's error rate departs from its nominal level, and the fix is one keyword: `equal_var=False` gives Welch's t-test, "which does not assume equal population variance"; `f_oneway` gained the same switch for Welch's ANOVA. Levene's test checks the assumption and is the right one to reach for on non-normal data — it "is an alternative to the Bartlett test [and] is less sensitive than the Bartlett test to departures from normality" — while Shapiro-Wilk "tests the null hypothesis that the data was drawn from a normal distribution". But the independence assumption is the one that silently destroys the result, and no test in the module detects it: correlated rows inside a unit shrink the standard error, which is the failure `design.md` opens with. Reaching for a non-parametric test does not repair it, because Mann-Whitney and Kruskal-Wallis assume independent samples too.

**Backing.** `source` — the three ANOVA assumptions and SciPy's own fallback advice ("it may still be possible to use the Kruskal-Wallis H-test ... or the Alexander-Govern test ... although with some loss of power"): SciPy `f_oneway` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html. The `equal_var` default and Welch: SciPy `ttest_ind` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html. Variance check: SciPy `levene` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.levene.html and NIST/SEMATECH *e-Handbook of Statistical Methods*, §1.3.5.10 *Levene Test for Equality of Variances* — https://www.itl.nist.gov/div898/handbook/eda/section3/eda35a.htm: "Some statistical tests, for example the analysis of variance, assume that variances are equal across groups or samples. The Levene test can be used to verify that assumption." Normality check: SciPy `shapiro` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.shapiro.html, and NIST §7.2.1.3 — https://www.itl.nist.gov/div898/handbook/prc/section2/prc213.htm, on Anderson-Darling and Shapiro-Wilk as tests of "distributional adequacy", where "small values of W are evidence of departure from normality". Independence as the unrepairable one: Deng, Lu and Litz, WSDM 2017 — https://alexdeng.github.io/public/files/WSDM2017draft.pdf.

---

### At online sample sizes the t-test survives heavy tails — but "large enough" is 355 × skewness², not 30

**What it requires.** The normality assumption behind a t-test is about the sampling distribution of the *mean*, not about the raw metric. So the question is never "is revenue per user normally distributed" (it never is); it is "do I have enough units for the mean to be approximately normal at the tails", and that threshold scales with the square of the skewness.

**When it applies.** Any per-user metric that is revenue, counts, durations, tokens, or a rare-conversion Bernoulli. Two observable triggers: a `shapiro` call on a million raw revenue rows used to justify abandoning the t-test, and the reverse — a t-test run on a few hundred units of a heavy-tailed metric on the grounds that n > 30.

**Why it bites.** Both errors are expensive and both look like diligence. The textbook rule Kohavi et al. quote and then reject — "if n ≥ 30, the normal approximation will be satisfactory regardless of the shape of the distribution" — is about the centre of the distribution, and "because we are looking at statistical significance using the tails of distributions, larger sample sizes are required". Their replacement is concrete: the minimum number of i.i.d. observations "needed for the mean to have a normal distribution is 355 × s² for each variant, where s is the skewness coefficient", recommended whenever |skewness| > 1. At Bing, "Revenue/User had a skewness of 18.2 and therefore 114k users were needed"; at 100 or 1,000 users "the distribution of the sample mean is quite skewed and the 95% two-side confidence interval assuming normality would miss the true mean more than 5%", while at 100k it is close to normal. Above that threshold the t-test is fine and the whole worry evaporates — Deng et al. note that online tests' large samples mean "the central limit theorem guarantees τ̂ will approximately follow a normal distribution ... and a z-test can substitute for a t-test in analyses". The residual trap is allocation: skew plus *unequal* arm sizes breaks the symmetry that makes this work. Kohavi, Deng and Vermeer: "When a metric is positively skewed, and the control is larger than the treatment, the t-test will over-estimate the Type-I error on one tail and under-estimate on the other tail ... But when equal sample sizes are used, the convergence is similar and the Δ(observed delta) is represented well by a Normal- or t-distribution." So a 10/90 ramp on a revenue metric has an asymmetric false-positive rate, in the direction nobody checks.

**Backing.** `source` — the rule of thumb, its derivation from Boos and Hughes-Oliver, and the Bing numbers: Kohavi, Deng, Longbotham and Xu, *Seven Rules of Thumb for Web Site Experimenters*, KDD 2014, Rule #7 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf, whose table reports Revenue/User at |skewness| 17.9 needing 114k units for 4.4% sensitivity, against Capped Revenue/User at 5.2 needing 9.7k, and notes "at a commerce site, the skewness for purchases/customer was >10 and for revenue/customer >30". Asymptotic normality at online scale: Deng, Lu and Litz, *Trustworthy Analysis of Online A/B Tests*, WSDM 2017 — https://alexdeng.github.io/public/files/WSDM2017draft.pdf. The unequal-allocation interaction, with A/A simulations at skewness 35 and 100: Kohavi, Deng and Vermeer, *A/B Testing Intuition Busters*, KDD 2022, §7 "Beware of Unequal Variants" — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf. Note the interaction with `metrics.md`: capping the metric is simultaneously the fix for skew and the fix for sensitivity.

---

### Small n or an odd statistic: prefer a bootstrap, and be explicit about what a rank test would and would not prove

**What it requires.** When the unit count is small, when the distribution is severely skewed relative to that count, or when the statistic of interest is not a mean, do not force a parametric test. Bootstrap the statistic you actually care about and report its interval. If you use a rank test instead, restate the conclusion in the terms that test supports.

**When it applies.** An experiment on tens or low hundreds of accounts — normal for B2B work in this codebase, where `client_id` is the randomization unit and there are not thousands of clients. A metric that is a p95, a median handling time, or a ratio of sums. A pilot with 20 accounts per arm where someone reaches for `ttest_ind` because it is the function they know.

**Why it bites.** At small n the 355 × s² threshold is nowhere near met, so the t-test's interval is simply wrong, and it is wrong asymmetrically — the direction depends on the skew, so it is not conservative. The bootstrap sidesteps the distributional assumption for any statistic, but it does not sidestep the *independence* one: Deng et al. are explicit that "the bootstrap method does not circumnavigate the fundamental i.i.d. assumption because it relies on assuming that the unit sampled with replacement is i.i.d." — so bootstrap the randomization unit, not the row.

**Backing.** `source + debated` — bootstrap mechanics and interval methods: SciPy `bootstrap` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html. The i.i.d. caveat: Deng, Lu and Litz, WSDM 2017 — https://alexdeng.github.io/public/files/WSDM2017draft.pdf; Crook et al., KDD 2009, Pitfall 3, who use it exactly this way — "we now routinely use the bootstrap method to estimate variances whenever the experimental unit used in the calculation of the metric is different from the one used in the random assignment" — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf.
- *Position A (rank test — Mann-Whitney / Kruskal-Wallis):* assumption-light, robust to any amount of skew, no sample-size threshold to compute. Netflix's sequential testing work uses a Mann-Whitney statistic for exactly this reason — https://netflixtechblog.com/sequential-a-b-testing-keeps-the-world-streaming-netflix-part-1-continuous-data-cba6c7ed49df. Cost: it tests stochastic ordering, not the mean, and gives you no effect size in currency, minutes, or messages — which is what §3 requires you to report and what the decision is denominated in.
- *Position B (bootstrap the business statistic):* you get an interval on the exact quantity the decision uses — mean revenue per account, p95 latency, capped conversion — with no distributional assumption. Cost: it is computational rather than closed-form, needs the resampling unit chosen correctly, and at genuinely tiny n (a handful of units per arm) it inherits the same lack of information as everything else and produces a very wide interval, which is honest but unwelcome.
- **Recommendation:** bootstrap the statistic the decision is about, resampling the randomization unit. Use a rank test only when the question really is "did the distribution shift", and when you do, say so in the write-up instead of translating the result back into averages. **Tradeoff:** more compute and a wider, more honest interval, in exchange for the reported number and the tested hypothesis being the same object.

---

## What changed

- **"Just don't peek" has been superseded by "make peeking valid".** Through the mid-2010s the standard answer to continuous monitoring was a process rule. Johari, Pekelis and Walsh (2015/2019) and the confidence-sequence line that followed (Waudby-Smith et al., arXiv:2103.06476) made anytime-valid inference practical, and it is now in production at major platforms (Netflix, Feb 2024). Recommending "look once" without offering the sequential alternative is out-of-date advice for any system with a live dashboard.
- **Bonferroni-for-everything gave way to FDR on wide scorecards.** Benjamini and Hochberg's 1995 procedure is now the mainstream default for screening many metrics; FWER control is reserved for the decision metric. See https://en.wikipedia.org/wiki/False_discovery_rate.
- **The bright-line p < 0.05 verdict is explicitly discouraged by the ASA itself (2016).** Analyses that emit only a boolean, with no interval and no effect size, are no longer defensible as "standard practice"; the standard changed.
- **Naive stopping heuristics ("check after 100 conversions, then daily") that circulated in A/B-tool blog posts have no error guarantee.** They are neither fixed-horizon nor always-valid. If a tool documents a rule of this shape without naming its sequential method (mSPRT, group-sequential / alpha-spending, confidence sequences), treat it as an uncorrected peek.
- **"n ≥ 30 and the t-test is fine" is retired for online metrics.** The textbook rule concerns the centre of the distribution; significance testing reads the tails. Kohavi et al.'s 355 × skewness² threshold (KDD 2014, Rule #7) replaced it for skewed per-user metrics, and it is the number to ask for when someone justifies a test by sample size alone.
- **`equal_var=True` is still SciPy's default for `ttest_ind`, and is still the wrong default for most experiment data.** Welch's t-test is one keyword away and is the safer choice under unequal variances; SciPy added the equivalent `equal_var` switch to `f_oneway` (Welch's ANOVA) only in version 1.16.0, so older analysis code has no such option and silently assumes homoscedasticity.
- **Normality testing on raw data has fallen out of favour as a gate for the t-test.** The assumption is on the sampling distribution of the mean, so a Shapiro-Wilk rejection on a large sample of raw revenue rows is expected and uninformative. The modern check is the skewness-based sample-size threshold plus, when in doubt, a bootstrap — not a goodness-of-fit test on the raw column.

## Sources I could not open or verify

- Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing* (Cambridge, 2020): only the landing page https://experimentguide.com/ was retrievable. No claim above is sourced to the book text.
- Amrhein, Greenland and McShane, *Scientists rise up against statistical significance*, Nature 567, 305–307 (2019) — https://www.nature.com/articles/d41586-019-00857-9: the fetch returned navigation and the reference list, not the article body. It is a well-known corroborating source for the "retire the bright line" position, but nothing above is quoted from it; the ASA 2016 statement, which was retrieved in full, carries that argument here instead.
- Benjamini and Hochberg (1995), original JRSS-B paper: the PDF copies located were image scans with no extractable text. FDR is characterised above from https://en.wikipedia.org/wiki/False_discovery_rate and from §7 of Johari, Pekelis and Walsh (arXiv:1512.04922), both of which were opened.
- Gelman and Loken; Simmons, Nelson and Simonsohn: quoted **as quoted inside** Kohavi, Deng and Vermeer (KDD 2022), whose PDF was opened. Originals not fetched.
- **Boos and Hughes-Oliver**, the source Kohavi et al. derive the 355 × skewness² rule from, is cited **as cited inside** the KDD 2014 paper, whose PDF was opened and text-extracted. The original was not fetched, so the derivation is taken on their word; the rule itself is quoted verbatim from them.
- **SciPy documentation is version-pinned.** All SciPy quotations above are from the v1.18.0 reference pages as served at the URLs given. Function defaults change between releases — `f_oneway`'s `equal_var` parameter is documented as "Added in version 1.16.0" — so a claim about a default should be re-checked against the version actually installed rather than assumed stable.
- **No open, citable source states the Bayesian/frequentist choice for this layer.** The test-selection principles above are frequentist throughout because that is what the cited experimentation literature and SciPy implement. A Bayesian scorecard would restate several of them differently; no position is taken here, and none should be inferred.
