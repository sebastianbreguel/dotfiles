---
updated: 2026-08-16
ttl: 24 months
sources: 50
---

# Yuyo — EXPERIMENTS: index

**What this layer is for.** Reviewing code and queries that produce evidence for a business decision: A/B tests, feature-flag rollouts compared before and after, metric pipelines, scorecards, dashboards, and any analysis whose output is a number somebody will act on.

**Why it is not like the rest of Yuyo's knowledge.** A leakage bug inflates an offline metric and someone eventually notices when production disagrees. A bad experiment has no such corrective. It returns a plausible number, a human ships or kills a feature on it, and the system keeps running. The failure mode of this layer is **a business decision made confidently in the wrong direction, with no error, no alert, and no one who ever finds out.** Severity here is not "is the code wrong" but "how far does the decision travel before anything could contradict it". A number that leaves the team — into a deck, a dashboard, a pricing conversation — is the high-severity case, even when the code is short.

**Reading order.** `design.md` before the experiment exists, `analysis.md` once it has data, `metrics.md` whenever the question is what the number means or who it describes. `metrics.md` also applies with no experiment at all — most reporting queries in this repo are metrics work without a treatment. `cohorts.md` is the fourth case: no treatment *and* no single point in time — a population followed forward, where the unit of analysis is a group defined by when it arrived.

---

## design.md — before the first user is assigned

| Principle | Observable trigger |
|---|---|
| Randomize on the unit you analyze, or use a variance estimator that knows they differ | The assignment key (`hash(user_id)`) is not the key the metric averages over (`AVG(...)` per message, ticket, page view) |
| Randomize at the level that contains the spillover | Assignment key strictly finer than the scope of the treatment's write: per-conversation flag mutating an account row, per-request flag warming a shared cache |
| Treat the trigger condition as part of the design | `if (flag && someCondition)` — especially when `someCondition` only exists inside the treatment branch and cannot be evaluated for control |
| Compute the sample size before launch and record the MDE | An experiment config or rollout flag merged with no target sample size and no target duration |
| Never compute power after the fact | "Observed power", "post-hoc power", or a power call whose effect-size argument is the measured effect |
| Run at least one full weekly cycle; do not extrapolate day 1–4 | Experiment shorter than 7 days, or a conclusion drawn from the slope of a delta-over-time chart |
| Do not assume running longer buys power | A config change that only moves the end date, to "reach significance" on a cumulative per-user metric |
| Freeze the decision rule before launch | Analysis query commit date later than the experiment start date; a segment, filter, or metric added mid-flight |
| Run an A/A test against the real pipeline | A diff touching the hash function, bucket count, salt, exposure logging, or the metric SQL |
| SRM is the gate: if it fires, do not read the metrics | A scorecard reporting deltas with no chi-square check of observed vs configured unit counts per arm |
| Do not reuse buckets across consecutive experiments | Assignment configured as fixed bucket ranges reused experiment after experiment, with no re-salting |

## analysis.md — once it has data

| Principle | Observable trigger |
|---|---|
| Do not stop because you saw significance | A live p-value on a running experiment **plus** a human or automation with authority to stop |
| If anyone can act mid-flight, use always-valid inference | A framework exposing a live `significant?` flag, an auto-rollback on a metric, or `ttest_ind` inside a monitoring loop |
| Count every comparison you actually made | A `for` loop or `GROUP BY` that multiplies tests; a reported segment win from an analysis that ran many segments |
| Segment findings are hypotheses, not results | `WHERE segment = ...` added after launch; any "it worked for X" where X was not pre-registered |
| Report the interval and effect size, not the verdict | An analysis returning `{ p_value, significant }`; a PR claiming "significant improvement" with no number |
| "Not significant" is not "no effect" | A conclusion of "no change" / "no regression" with no confidence interval or MDE printed |
| Replicate a borderline win before shipping | p roughly between 0.01 and 0.05 on the primary metric, especially one that rarely moves |
| Twyman's law: too-good is a bug until proven otherwise | An effect far outside the metric's historical range, or movement on metrics the change should not touch |
| Separate novelty and primacy from the steady state | A monotone delta-over-time chart used as a forecast; "users just need time to adapt" |
| Start from the prior that the change did nothing | A write-up whose language assumes the win and uses the statistics as confirmation |
| Write H0 and H1 down, and check which null the function tests | Any `scipy.stats.*` / `statsmodels` call; a test swapped for robustness without restating the claim |
| Choose the test from the outcome shape and the number of arms | `chi2_contingency` on a sparse table; pairwise `ttest_ind` in a loop over k variants; a t-test on a p95 |
| Check the assumption before you lean on it — and the right one | `ttest_ind` with the default `equal_var=True`; no variance or independence check anywhere near the call |
| "Large enough" for a t-test is 355 × skewness², not 30 | Heavy-tailed per-user metric (revenue, counts, durations) at a few hundred units; or `shapiro` on raw rows |
| Small n or a non-mean statistic: bootstrap the randomization unit | Tens of accounts per arm; a metric that is a median, p95, or ratio of sums |

## metrics.md — what the number means and who it describes

| Principle | Observable trigger |
|---|---|
| Name the business outcome, the proxy, and the gap | A ship metric that is a click / rate / engagement count in a discussion framed in revenue or retention |
| A mid-funnel proxy does not license an end-of-funnel claim | Metric measures step *n*, conclusion is about step *n+k*: clicks standing in for purchases, tool calls for tool value |
| Guardrails are mandatory and must be able to block | A scorecard containing only metrics the change was designed to improve; an AI feature with no cost or latency metric |
| Write the denominator into the name and check it | `COUNT(x)::float / COUNT(y)`, or any metric named "rate", "ratio", "per", "%" |
| Check the metric's own sample ratio | `AVG(x)` over events the treatment can create or destroy (page loads, tickets, LLM calls) |
| Cap or quantile a heavy tail; never a bare `AVG` | `AVG(revenue)`, `AVG(duration_ms)`, `AVG(message_count)`; also any treatment-dependent outlier filter |
| Never compare non-equivalent periods; drop the ramp-up | Month-over-month comparisons; analysis windows spanning an allocation change (5% → 20% → 50%) |
| Exclude test / internal / bot rows, explicitly, per query | Raw SQL aggregating a table with a test flag (`appointment.is_test`, `ticket_v2.is_test`, `platform = 'playground'`) |
| A metric can move because logging moved | Metrics built on client-emitted events, beacons, or webhooks, where the change touches timing, batching, or transport |
| A capped greedy-by-volume selection is a sampling design — declare it | `ORDER BY volume DESC LIMIT :cap`, or a budget loop that `break`s when exhausted — **and every downstream aggregate over its output** |
| A metric is undefined until numerator, denominator, window and inclusion are written | A metric name that hides a choice: "response time", "active accounts", "resolution rate"; two queries computing the same name differently |
| Label leading vs lagging, and treat the link as a model with a date on it | A short-horizon dashboard standing in for a quarterly outcome; "this went up, therefore retention will" |
| Goodhart: a metric someone is judged by stops measuring what it measured | A metric that someone's work is judged by, which they can move without moving the outcome; metric definition and target owned by the same person |

## cohorts.md — a population followed forward through time

| Principle | Observable trigger |
|---|---|
| Write the cohort definition down: entry event, entry timestamp, exit criteria | `DATE_TRUNC('week', created_at)` feeding a retention number, where the schema offers three plausible entry columns |
| A membership rule that depends on the future is a survivorship filter | The cohort definition joins or filters on a post-entry event: `WHERE onboarding_completed_at IS NOT NULL`, `total_orders > 5`, `status = 'active'` |
| Read the triangle down a column, and mark the incomplete cells | `GROUP BY cohort_week, weeks_since_signup` pivoted into a table; an "overall retention" row over a window whose tail has not finished |
| Users who have not churned yet are censored, not retained | `AVG(churned_at - created_at)`, `AVG(NOW() - created_at)`, any "average customer lifetime" or LTV denominator |
| N-day, on-or-after, and rolling retention are three different metrics | `= day_7` vs `>= day_7` vs `BETWEEN day_1 AND day_7`; calendar `DATE_TRUNC` vs a rolling 24-hour interval |
| Do not pool cohorts of unequal size without weighting | `AVG(retention_rate)` over per-cohort rates; one headline number over a window containing an acquisition spike |
| A cohort comparison isolates nothing on its own | "Cohorts after the March release retain better" — two `WHERE signup_month = ...` slices with no covariate held fixed |

---

## Tie-breaks

When more than one file could own a finding:

- **The trigger is an assignment, a flag, a sample size, or a stop date → `design.md`.** Anything that had to be decided before data existed.
- **The trigger is a p-value, a threshold, a segment, or a comparison count → `analysis.md`.** Anything about reading an existing delta.
- **The trigger is a `SELECT` → `metrics.md`.** If the finding survives with no experiment at all — a dashboard, a monthly report, a KPI — it is a metrics finding, not an experiment one.
- **SRM belongs to `design.md`, metric-level SRM to `metrics.md`.** Experiment-level (unit counts per arm differ from the configured split) is a validity gate on the whole test. Metric-level (the denominator counts differ between arms) invalidates one metric and leaves the rest readable.
- **Peeking vs duration.** "Can I look now?" is `analysis.md`. "How long should this run?" is `design.md`. A request to extend a running test to reach significance is both, and the `design.md` entry is the one to lead with, because the fix is a pre-declared horizon, not a correction after the fact.
- **Denominator vs proxy.** If the number is measuring the right concept over the wrong base, that is the denominator principle. If it is measuring the wrong concept correctly, that is the proxy principle. The second is more severe: a denominator bug is arithmetic, a proxy mismatch is strategy.
- **The trigger is a time axis of "periods since the unit arrived" → `cohorts.md`.** If the analysis follows a group forward from an entry event — a retention table, a churn curve, an activation rate by signup week — it is cohort work, even when it never mentions cohorts. If the time axis is calendar time and there is no entry event, it is a `metrics.md` reporting query.
- **Cohort definition vs metric definition.** Both files demand that things be written down, and they demand different things. `metrics.md` owns *what is being counted* — numerator, denominator, window, inclusion criteria. `cohorts.md` owns *who is in the group and when their clock starts* — entry event, entry timestamp, exit criteria. A retention query needs both, and the review comment should name whichever half is missing. When both are missing, lead with the cohort definition: an undefined population makes a well-defined metric meaningless, but a well-defined population with a fuzzy metric is still fixable in one place.
- **Denominator problems split by cause.** A denominator the *treatment* can move is `metrics.md` (metric-level sample ratio). A denominator that shrinks because the newest cohorts have not lived long enough is `cohorts.md` (censoring). They look identical in a query — a ratio that moved without the numerator moving — and the fix is completely different: one invalidates the metric for that experiment, the other is repaired by excluding incomplete cells.
- **Simpson's paradox has two homes.** Pooling across periods with different treatment *allocations* is `metrics.md`. Pooling across cohorts of different *sizes* is `cohorts.md`. Same arithmetic, different thing to hold fixed; cite the one whose remedy matches the code in front of you.
- **Which test vs whether to trust the test.** "Is this the right test for this data" is `analysis.md` §5. "Should this p-value be read at all" — peeking, multiplicity, SRM — is §1-2 of `analysis.md` and `design.md`. When both apply, the validity gate wins: there is no point correcting a t-test to a Mann-Whitney on a scorecard whose SRM check never ran.
- **When the finding is "this number left the team",** raise the severity one level regardless of which file it came from. A wrong number inside a notebook is a bug; the same number inside a customer-facing deck is the failure this layer exists to prevent.

---

## Sources I could not open or verify

- **Kohavi, Tang and Xu, _Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing_ (Cambridge University Press, 2020).** This is the canonical reference for the whole layer and it is not publicly readable. Only the authors' landing page was retrieved: https://experimentguide.com/. **No principle in this layer is sourced to the book's text.** Every claim traces to a paper whose PDF was downloaded and quoted directly — mostly by the same authors, which is why the coverage lines up with the book's structure.
- **Kohavi and Thomke, _The Surprising Power of Online Experiments_, HBR, Sept–Oct 2017** — https://hbr.org/2017/09/the-surprising-power-of-online-experiments: fetch returned title and byline only; body is paywalled. Not cited for any claim.
- **Amrhein, Greenland and McShane, _Scientists rise up against statistical significance_, Nature 567, 305–307 (2019)** — https://www.nature.com/articles/d41586-019-00857-9: fetch returned navigation and the reference list, not the article body. Not quoted; the ASA 2016 statement (retrieved in full) carries that argument in `analysis.md` instead.
- **Benjamini and Hochberg (1995), original JRSS-B paper.** Every located PDF copy was an image scan with no extractable text. FDR is characterised from https://en.wikipedia.org/wiki/False_discovery_rate and from §7 of Johari, Pekelis and Walsh (arXiv:1512.04922), both opened.
- **Secondary quotes.** Hoenig and Heisey (2001), Gelman (2019), Greenland (2012), Gelman and Loken (2014), Simmons/Nelson/Simonsohn (2011) appear **as quoted inside** Kohavi, Deng and Vermeer, KDD 2022, whose PDF was opened. The originals were not fetched, and the citations say so where they appear.
- **The greedy-by-volume cap.** No open source was found that states this specific failure in these terms. The principle is assembled from a primary source for the estimator (Horvitz–Thompson) plus the selection-bias framing from the SRM literature. It is marked `consensus`, not `source`, in `metrics.md`.
- **Goodhart (1975), *Problems of Monetary Management: The U.K. Experience*.** Not available online in any openable form. Quoted **as quoted in** https://en.wikipedia.org/wiki/Goodhart%27s_law, which was retrieved in full.
- **Strathern (1997), *'Improving ratings': audit in the British University system*, European Review 5(3), 305–321.** Cambridge Core is paywalled; the Internet Archive copy at https://archive.org/details/ImprovingRatingsAuditInTheBritishUniversitySystem is an image-only scan with no extractable text — the same failure already recorded for Benjamini and Hochberg. Quoted at one remove, via the Wikipedia article, which attributes the wording upstream to Hoskin (1996). **Chrystal and Mizen (2001)** was sought as a peer-reviewed secondary source for the same formulation; every host returned a paywall or HTTP 403. Not cited.
- **Kaplan and Norton (balanced scorecard), the usual origin for "leading/lagging indicator".** Paywalled at HBR, not opened. The leading/lagging principle in `metrics.md` is sourced entirely to Hohnhold, O'Brien and Tang (KDD 2015), whose PDF was opened and text-extracted; "leading" and "lagging" are this layer's labels for the short-term/long-term distinction that paper draws.
- **Boos and Hughes-Oliver**, from whom Kohavi et al. derive the 355 × skewness² rule, is cited **as cited inside** the KDD 2014 paper. The original was not fetched.
- **Redelmeier and Singh (2001) and its reanalysis**, the immortal-time-bias example in `cohorts.md`, are described **as described inside** https://en.wikipedia.org/wiki/Survivorship_bias. https://en.wikipedia.org/wiki/Immortal_time_bias has no standalone article and redirects there; no dedicated open primary source on immortal time bias was retrieved.
- **Vendor documentation (Amplitude, Mixpanel) is authoritative for that vendor's semantics only.** In `cohorts.md` it is cited for definitional facts — that N-day and on-or-after are different metrics, that incomplete cells are excluded, that day boundaries are configurable — not for statistical claims.
- **SciPy quotations are version-pinned to v1.18.0** as served at the URLs listed. Defaults change between releases (`f_oneway`'s `equal_var` is documented as "Added in version 1.16.0"), so re-check a default against the installed version rather than assuming it is stable.

## Sources cited across this layer

Papers whose full text was downloaded and quoted:

1. Kohavi, Deng, Vermeer — *A/B Testing Intuition Busters*, KDD 2022 — https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e2fa7b398b362f2299ec1a/1692596863066/A:B+Testing+Intuition+Busters.pdf (landing: https://exp-platform.com/abtestingintuitionbusters/)
2. Fabijan et al. — *Diagnosing Sample Ratio Mismatch*, KDD 2019 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf
3. Microsoft Research — *Diagnosing Sample Ratio Mismatch in A/B Testing* — https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/
4. Johari, Koomen, Pekelis, Walsh — *Peeking at A/B Tests*, KDD 2017 — http://library.usc.edu.ph/ACM/KKD%202017/pdfs/p1517.pdf
5. Johari, Pekelis, Walsh — *Always Valid Inference*, arXiv:1512.04922 — https://arxiv.org/pdf/1512.04922
6. Waudby-Smith, Arbour, Sinha, Kennedy, Ramdas — *Time-uniform central limit theory and asymptotic confidence sequences*, arXiv:2103.06476 — https://arxiv.org/pdf/2103.06476
7. Kohavi, Deng, Longbotham, Xu — *Seven Rules of Thumb for Web Site Experimenters*, KDD 2014 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf
8. Kohavi, Deng, Frasca, Longbotham, Walker, Xu — *Five Puzzling Outcomes Explained*, KDD 2012 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf
9. Kohavi, Deng, Frasca, Walker, Xu, Pohlmann — *Online Controlled Experiments at Large Scale*, KDD 2013 — https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf
10. Crook, Frasca, Kohavi, Longbotham — *Seven Pitfalls to Avoid*, KDD 2009 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf
11. Dmitriev, Gupta, Kim, Vaz — *A Dirty Dozen*, KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf
12. Deng, Lu, Litz — *Trustworthy Analysis of Online A/B Tests*, WSDM 2017 — https://alexdeng.github.io/public/files/WSDM2017draft.pdf
13. Deng, Shi — *Data-Driven Metric Development: Seven Lessons Learned*, KDD 2016 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf
14. Deng, Xu, Kohavi, Walker — *CUPED*, WSDM 2013 — https://exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf
15. Chen, Liu, Xu (LinkedIn) — *Automatic Detection and Diagnosis of Biased Online Experiments*, arXiv:1808.00114 — https://arxiv.org/pdf/1808.00114
16. Netflix Technology Blog — *Sequential A/B Testing…, Part 1* (Feb 2024) — https://netflixtechblog.com/sequential-a-b-testing-keeps-the-world-streaming-netflix-part-1-continuous-data-cba6c7ed49df
17. American Statistical Association — *Statement on Statistical Significance and P-Values* (2016) — https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf

18. Hohnhold, O'Brien, Tang (Google) — *Focusing on the Long-term: It's Good for Users and Business*, KDD 2015 — https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43887.pdf

Official documentation:

19. Google — *Site Reliability Engineering*, Ch. 4 *Service Level Objectives* — https://sre.google/sre-book/service-level-objectives/
20. SciPy — *Hypothesis tests* (tutorial index) — https://docs.scipy.org/doc/scipy/tutorial/stats/hypothesis_tests.html
21. SciPy — `ttest_ind` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html
22. SciPy — `mannwhitneyu` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html
23. SciPy — `chi2_contingency` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html
24. SciPy — `fisher_exact` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fisher_exact.html
25. SciPy — `f_oneway` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html
26. SciPy — `kruskal` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kruskal.html
27. SciPy — `bootstrap` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html
28. SciPy — `levene` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.levene.html
29. SciPy — `shapiro` — https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.shapiro.html
30. NIST/SEMATECH — *e-Handbook of Statistical Methods*, §1.3.5.10 *Levene Test for Equality of Variances* — https://www.itl.nist.gov/div898/handbook/eda/section3/eda35a.htm
31. NIST/SEMATECH — §7.2.1.3 *Anderson-Darling and Shapiro-Wilk tests* — https://www.itl.nist.gov/div898/handbook/prc/section2/prc213.htm
32. lifelines — *Introduction to survival analysis* — https://lifelines.readthedocs.io/en/latest/Survival%20Analysis%20intro.html
33. Amplitude Docs — *How the Retention Analysis chart calculates retention* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-calculation
34. Amplitude Docs — *Interpret your retention analysis* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-interpret
35. Amplitude Docs — *How time works in a retention analysis* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-time
36. Mixpanel Docs — *Retention: Measure engagement over time* — https://docs.mixpanel.com/docs/reports/retention

Reference pages:

37. *Twyman's law* — https://en.wikipedia.org/wiki/Twyman%27s_law
38. *Horvitz–Thompson estimator* — https://en.wikipedia.org/wiki/Horvitz%E2%80%93Thompson_estimator
39. *False discovery rate* — https://en.wikipedia.org/wiki/False_discovery_rate
40. *Goodhart's law* — https://en.wikipedia.org/wiki/Goodhart%27s_law
41. *Simpson's paradox* — https://en.wikipedia.org/wiki/Simpson%27s_paradox
42. *Survivorship bias* — https://en.wikipedia.org/wiki/Survivorship_bias
43. *Censoring (statistics)* — https://en.wikipedia.org/wiki/Censoring_(statistics)
44. *Kaplan–Meier estimator* — https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator
45. Kohavi, Tang, Xu — book landing page — https://experimentguide.com/ (listed for provenance; not cited for any claim)
