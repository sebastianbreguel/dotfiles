---
updated: 2026-08-16
ttl: 24 months
sources: 13
---

# Yuyo — Experiments: Metrics

**What this covers.** What the number actually measures, and who it actually describes. The gap between the business outcome and the proxy you can compute; denominators; guardrails; averages that hide the tail; periods that are not comparable; rows that should never have been counted; and sampling policies that silently decide which accounts your aggregates are about. Out of scope: how the experiment was randomized (`design.md`) and how the resulting delta is tested (`analysis.md`).

**The failure mode.** A metric bug does not throw. It returns a number of the right type, in the right range, on a dashboard somebody trusts. The people who read it make a resourcing, pricing, or roadmap decision, and there is no downstream signal that says the number described a different population, a different period, or a different quantity than the one the decision was about. That is why the rules below are about *declaring* things — the population, the denominator, the exclusions — rather than about computing them correctly. Correct arithmetic over an undeclared population is the whole problem.

**Backing scale.** Same as the core file.

- **`source`** — paper, standard, or official documentation cited with a URL.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both named, one recommended, with the tradeoff.

---

## 1. The business metric and the proxy

### Name the business outcome, then name the proxy, then state the gap between them

**What it requires.** Every experiment or dashboard has two metrics written down: the thing the business actually wants (revenue, retention, resolved tickets), and the thing you can measure inside the experiment's horizon (clicks, replies, engagement). The relationship between them is an assumption, and it has to be stated as one.

**When it applies.** A ship metric that is a click, a rate, an engagement count, or a model score, in a discussion framed in revenue or retention terms. Observable in code as the single column an experiment's `is_winner` logic reads.

**Why it bites.** Short-horizon proxies are easy to move in ways that destroy the long-horizon outcome — that is precisely why they are easy to move. Crook et al. name it as their first pitfall: "Picking an OEC for which it is easy to beat the control by doing something clearly 'wrong' from a business perspective." Once the proxy is the target, every subsequent experiment optimises it, and the divergence compounds silently because nobody re-checks the assumption that linked it to the outcome. The decision that gets made wrong is not one launch; it is a year of launches pointed slightly off-axis.

**Backing.** `source` — Crook, Frasca, Kohavi and Longbotham, *Seven Pitfalls to Avoid when Running Controlled Experiments on the Web*, KDD 2009 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf, Pitfall 1. They also caution against over-correcting: "Sometimes picking a simple OEC is a good way to start experimenting, without worrying about the perfect OEC" — a simple conservative proxy that *already* shows the idea is negative is enough to kill it. On building the proxy deliberately: Deng and Shi, *Data-Driven Metric Development for Online Controlled Experiments: Seven Lessons Learned*, KDD 2016 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf, Lesson 3, which requires every candidate metric to be scored on two qualities before use — *sensitivity* ("If a metric rarely shows movement with statistical significance … it is not actionable in practice no matter how good the metric is in all other aspects") and *directionality* ("if a metric frequently gives us statistically significant signals, but we have little confidence on how to relate the movement to the success of the business, then the metric is disqualified to act as a goal metric").

---

### A proxy that stops mid-funnel does not license a claim about the end of the funnel

**What it requires.** If the outcome is terminal (revenue, a completed booking, a resolved ticket), the metric that decides the ship must be terminal too, or the analysis must explicitly report that the terminal step did not move.

**When it applies.** A funnel where the measured step is upstream of the outcome being claimed: clicks on a promotion standing in for purchases, checkout-link sends standing in for orders, suggestions shown standing in for suggestions accepted. In our codebase this is the shape of most assistant metrics — a tool was called, therefore the tool helped.

**Why it bites.** Upstream steps are the cheap ones to move, so an intervention reliably lifts them without touching the outcome, and the funnel step in between absorbs the difference. Dmitriev et al. report Xbox promotion experiments where changing images and messaging produced "large positive impacts on the number of users who click through to the sale" and, in tests with sufficient power, no corresponding revenue increase — while costing users "wasted time and effort". Reported as a click lift, that is a win; reported end-to-end, it is a net negative that shipped.

**Backing.** `source` — Dmitriev, Gupta, Kim and Vaz, *A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments*, KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf, §5.11: "While it is easy to increase the number of clicks we obtain on specific locations it does not directly relate to our aim of increasing revenue. In some of these experiments we did not see any corresponding revenue increase even when it had sufficient power."

---

### Every scorecard carries guardrail metrics, and they must be able to block the ship

**What it requires.** Alongside the success metric, a fixed set of metrics that the change is not allowed to harm — latency, error rate, cost per interaction, escalation rate, unsubscribe rate. They are declared before launch and a regression on them stops the launch regardless of the success metric.

**When it applies.** An experiment write-up or dashboard listing only metrics the change was designed to improve. Also: a new AI feature whose scorecard has quality metrics but no cost-per-conversation and no latency.

**Why it bites.** The success metric is chosen by the person who wants the change to work, so it is structurally optimistic. Guardrails are the only part of the scorecard designed to say no. Without them, the harm shows up in a different team's metric a quarter later, at which point the causal link to the launch is unrecoverable and the feature stays. Note the interaction with `analysis.md`: guardrails are usually the underpowered metrics, so "guardrail did not move" must always be read together with its confidence interval.

**Backing.** `source` — Deng and Shi, KDD 2016 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf, Lesson 2: guardrail metrics "help to guard against situations when the goal metrics may give us wrong signals", used both to substitute for a goal metric where it does not apply and "to capture the dimensions of user experience that the goal metrics are not able to measure". Corroborating with the operational definition: Dmitriev et al., KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf: "there is a set of metrics which are not clearly indicative of success of the feature being tested, but which we do not want to significantly harm when making a ship decision. We call these metrics Guardrail metrics. For instance, on a web site like Bing or MSN, Page Load Time (PLT) is usually a guardrail metric." The same paper puts *data quality* metrics (SRM and friends) ahead of both: "After checking the Data Quality metrics, next we want to know the outcome of the experiment."

---

## 2. Denominators

### Write the denominator into the metric name and check it in the query

**What it requires.** A rate metric is never reported as a bare percentage. Its name states the denominator ("resolution rate per assigned ticket", not "resolution rate"), and the analysis reports numerator and denominator as separate metrics next to the ratio.

**When it applies.** Any `COUNT(x)::float / COUNT(y)` or `SUM(a) / SUM(b)` in a reporting query, and any metric whose name ends in "rate", "ratio", "per", or "%". Especially when the denominator is something the change can move — messages sent, sessions started, tickets opened.

**Why it bites.** A rate can rise five different ways and only one of them is unambiguously good. Deng and Shi enumerate them: numerator up with denominator stable (good); denominator down with numerator stable; both moving in either direction. "Among these five possibilities, except for (a), the goodness of all other cases are ambiguous." A treatment that suppresses the denominator — fewer tickets opened because the entry point got harder to find — shows up as a beautiful improvement in resolution rate. Reporting the ratio alone makes those five worlds indistinguishable, and the reader defaults to the flattering one.

**Backing.** `source` — Deng and Shi, KDD 2016 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf, Lesson 6 ("Choose the right rate metrics"). Corroborating, with the decomposition recipe: Dmitriev et al., KDD 2017, §5.2 and their worked breakdown — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf: "two separate metrics at user level could be created for numerator and denominator … it is a good idea to always have such a decomposition on the scorecard."

---

### Check the metric's own sample ratio, not only the experiment's

**What it requires.** For any metric whose denominator is not the randomization unit, compare the denominator counts between arms. If they differ, the metric is invalid for that experiment even when the experiment-level sample ratio check passed.

**When it applies.** Averages over events: average latency per page load, average handling time per ticket, average tokens per LLM call. The trigger is `AVG(x)` where the rows being averaged can themselves be created or destroyed by the treatment.

**Why it bites.** If the treatment changes which events exist, the two arms are averaging over different populations of events and the delta is a mixture of the real effect and the composition change — in an arbitrary direction. Dmitriev et al. give the canonical case: a treatment produced 7.8% fewer homepage loads than control because it removed a fast browser-back reload path. The remaining loads in treatment were the slow ones, so average page load time looked substantially worse, and the "performance regression" was entirely composition. Their verdict: "similarly to how an SRM invalidates the results of the whole experiment, a metric sample ratio mismatch usually invalidates the metric".

**Backing.** `source` — Dmitriev et al., KDD 2017, §5.1 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf: "the treatment-control delta may change in an arbitrary direction, and the statement 'the new feature X caused Y amount of metric change' is no longer valid." Causes they list include behaviour change, telemetry loss differing by arm, and incorrect instrumentation of new features. The experiment-level analogue: Fabijan et al., *Diagnosing Sample Ratio Mismatch in Online Controlled Experiments*, KDD 2019 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf.

---

## 3. Distributions, periods, and rows

### An average over a heavy tail is not a summary; cap it or report a quantile

**What it requires.** For skewed quantities — revenue, latency, message volume, tokens — report a capped mean, a quantile, or the distribution. A raw `AVG()` on a heavy-tailed column is a number dominated by a handful of rows.

**When it applies.** `AVG(revenue)`, `AVG(duration_ms)`, `AVG(message_count)` in any reporting or experiment query. Also: an experiment on a small population where a single enterprise account can move the mean by itself.

**Why it bites.** Two costs, both invisible. First, the mean stops being a stable estimate: Kohavi et al. measured skewness of 18.2 on Revenue/user at Bing, which means the central limit theorem needs far more users than the textbook rule suggests before the mean is approximately normal — and every p-value computed on it before then is wrong. Second, sensitivity: after capping Revenue/user at $10 per user per week, skewness dropped from 18 to 5.3 and the same sample size could detect "a change 30% smaller". So the uncapped average is simultaneously less trustworthy and less able to find real effects. The related trap is the outlier *filter*: Dmitriev et al. describe an MSN experiment where increasing the number of slides raised engagement so much that real users crossed the bot-detection threshold and were dropped from the analysis, producing both an SRM and an apparent engagement regression.

**Backing.** `source` — Kohavi, Deng, Longbotham and Xu, *Seven Rules of Thumb for Web Site Experimenters*, KDD 2014 — https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf, Rule #7 ("Have Enough Users"): "When a metric has a large skewness, it is sometimes possible to transform the metric or cap the values to reduce the skewness so that the average converges to normality faster. After we capped Revenue/User to $10 per user per week, we saw skewness drop from 18 to 5.3 and sensitivity (i.e. power) increased. For the same sample size, Capped Revenue per user can detect a change 30% smaller than Revenue per user." Treatment-dependent filtering: Dmitriev et al., KDD 2017, §5.9 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf.

---

### Never compare periods that are not equivalent, and drop the ramp-up

**What it requires.** A before/after or month-over-month comparison must cover equivalent calendar structure and equivalent traffic composition. When an experiment's allocation changed mid-flight (5% → 20% → 50%), the periods with different splits cannot be pooled.

**When it applies.** Any query with `WHERE date >= last_month` compared against `WHERE date >= this_month`. Any experiment analysis whose window spans a gradual rollout. Any metric compared across a period containing a holiday, a promotion, or a deploy that changed instrumentation.

**Why it bites.** Pooling periods with different treatment proportions produces Simpson's paradox: the treatment can be better in every individual period and worse in the pooled total, or the reverse. Crook et al. state flatly that these occurrences "are unintuitive, [but] they are not uncommon, and we have seen them happen multiple times in real life." The pooled number is arithmetically correct, has a large sample size, and points the wrong way — which is the most persuasive possible form of a wrong answer.

**Backing.** `source` — Crook, Frasca, Kohavi and Longbotham, KDD 2009 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf, Pitfall 4 ("Combining metrics over periods where the [proportions differ]"). Their remedies, in order of preference: "(i) paired t-tests where each pair (Control, Treatment) is chosen from a period where the proportions were stable; and (ii) using weighted combinations. The simplest solution, which we use, is to throw away the data from the ramp-up period, which is usually short relative to the experiment."

---

### Exclude test, internal, and bot rows before measuring — explicitly, in every query

**What it requires.** Every aggregate over a table that can contain synthetic rows filters them out by name, in that query. Not in a view somebody might bypass, not by convention: in the query. In this codebase that means `is_test IS NOT TRUE` on `appointment`, `ticket_v2.is_test`, and excluding `platform = 'playground'` / `EVAL_TRIAL` contacts.

**When it applies.** Any raw SQL that counts, sums, averages, or lists rows from a table carrying a test flag. Raw SQL is the sharp case because it bypasses the ORM entirely — even the automatic `deleted_at` soft-delete filter does not apply — so the exclusion must be written by hand next to `client_id` and the date range.

**Why it bites.** Synthetic rows are not noise; they are systematically unrepresentative. Evals and demo seeds generate happy paths, so they inflate exactly the metrics people report as successes. Bots are the same failure with a different origin: Crook et al. note that a robot distributed evenly across arms only adds noise, but "robots that act like a single user and consistently generate traffic for a single variant … can create a significant bias", producing a statistically significant difference in click-through rate that has nothing to do with the treatment. The corrupted number is plausible, the query is green, and nothing downstream can detect it.

**Backing.** `source + consensus` — bot-driven bias: Crook et al., KDD 2009, Pitfall 5 ("Neglecting to filter robots") — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf. Data-quality-metrics-first ordering: Dmitriev et al., KDD 2017 — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf. The repository-specific flags and the guard test that enforces them are documented in this project's `CLAUDE.md` under "Eval / Test Data Must Be Excluded From Queries"; the one documented exception is the eval's own context hydration, which must surface seeded rows to the assistant.

---

### A metric can move because logging moved, not because behaviour did

**What it requires.** Before attributing a metric change to the treatment, check whether the treatment changed how, when, or how reliably the underlying events are emitted. Instrumentation is part of the treatment.

**When it applies.** Metrics computed from client-emitted events, webhook deliveries, or fire-and-forget beacons, where the change touches timing, batching, navigation, or the transport. Also: a change that adds a new event type and a metric whose denominator counts events.

**Why it bites.** Telemetry loss is never uniform across arms, and a change that shifts loss rates moves every metric built on those events without moving any user behaviour. Dmitriev et al. describe a Skype experiment that only changed the push-notification protocol and produced "strong statistically significant changes in some call-related metrics" — with the giveaway that "the pattern of movement did not follow a typical 'improvement' or 'degradation' pattern". Kohavi et al. document the mirror image: click beacons that never reach the server, with losses "sometimes over 50%" in Safari, so that *adding a delay* made experiments look better artificially — a treatment could win by being slower.

**Backing.** `source` — Dmitriev et al., KDD 2017, §5.3 ("Telemetry Loss Bias") — https://archive.org/download/PitfallsInMetricInterpretationKDD/PitfallsInMetricInterpretationKDDFinalv2.pdf. Click-beacon loss: Kohavi, Deng, Frasca, Longbotham, Walker and Xu, *Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained*, KDD 2012, §3.2 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf: "Adding even a small delay gives the beacon more time, and hence more click request beacons reach the server. We have seen multiple experiments where added delays made an experiment look better artificially."

---

## 4. Sampling policy is a metric decision

### A capped, greedy-by-volume selection is a sampling design — declare it at every read site or the aggregates lie

**What it requires.** When a pipeline processes only part of the population because of a budget — a weekly cap on analyses, a token budget, a rate limit — the rule that decides *which* rows get processed is a sampling design and must be treated as one. Either make the inclusion probability known (random or stratified selection within the cap), or carry the inclusion probability on the row and weight by its inverse when aggregating. At minimum, every dashboard, metric, and report built on the output states the population it actually describes.

**When it applies.** Concretely observable: a selection query or scheduler that orders candidates by volume descending and takes until a cap is reached —

```sql
SELECT client_id, COUNT(*) AS volume
FROM conversation
WHERE created_at >= :week_start
GROUP BY client_id
ORDER BY volume DESC
LIMIT :weekly_cap
```

— or the imperative equivalent: sort accounts by row count, loop, subtract from a remaining budget, `break` when it hits zero. The trigger fires again, and more importantly, at every place that later aggregates the produced rows: `AVG(score)`, "% of conversations with X", "our accounts see Y" — any statement of the form "across our customers".

**Why it bites.** Greedy-by-volume makes the inclusion probability a deterministic function of volume: high-volume accounts are included every week with probability 1, low-volume accounts approach probability 0. The output is therefore not a sample of the customer base; it is a census of the largest customers. Every unweighted mean over it estimates the high-volume subpopulation, and the smaller the account, the more completely it is missing. That specific direction of bias is the expensive one, because small accounts are usually where churn, onboarding failure, and the worst quality live — the exact phenomena the aggregate is being consulted about. And nothing looks wrong at any point: the cap is a sensible cost control, the job succeeds, the row counts are large, the number is plausible. It is the greedy step, not the arithmetic, that decided what the metric means, and the greedy step lives in a scheduler that nobody reads when interpreting a dashboard.

The correction is standard survey sampling. If unit *i* is included with known probability πᵢ, an unbiased estimate weights each observation by 1/πᵢ (the Horvitz-Thompson estimator); ignoring πᵢ and taking a plain average is exactly the biased estimator that construction exists to replace. This is only available if πᵢ is knowable, which is the practical argument for making the selection random-within-strata rather than greedy: greedy is cheaper to implement and impossible to de-bias afterwards.

**Backing.** `source + consensus` — the estimator and the reason unequal inclusion probabilities require weighting: *Horvitz–Thompson estimator* — https://en.wikipedia.org/wiki/Horvitz%E2%80%93Thompson_estimator, "a method for estimating the total and mean of a pseudo-population in a stratified sample by applying inverse probability weighting to account for the difference in the sampling distribution between the collected data and the target population", used "to account for missing data, as well as many sources of unequal selection probabilities". The severity framing is the experimentation analogue: a mismatch between the population you designed and the population you measured is a *selection bias*, and Fabijan et al. treat it as invalidating rather than as a caveat — "SRMs cause a selection bias that invalidates any causal inference that could be drawn from the experiment" — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf, §4.2. The declaration requirement itself (`consensus`): no paper prescribes "annotate the dashboard with its population", but it follows directly from Deng and Shi's requirement that a metric have known directionality before it is allowed to guide a decision — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf, Lesson 3. A metric whose population changes weekly with the volume distribution has no stable directionality at all.

---

## 5. Definition, and what happens once someone is measured by it

### A metric is not defined until numerator, denominator, time window, and inclusion criteria are written down

**What it requires.** Four things, in writing, next to the metric's name: what is counted (numerator), over what base (denominator), over what window and with what aggregation, and which rows are in and which are out. A metric whose definition lives only in a SQL file is undefined for everyone who does not read that file — which is everyone who acts on it.

**When it applies.** Any new metric added to a scorecard, a dashboard, or a weekly report. The concrete trigger is a name that hides a choice: "response time" (mean or p95? measured from message received or from job dequeued? including or excluding out-of-hours?), "active accounts" (active how, over what window, counted at which timezone boundary?), "resolution rate" (the denominator rule from §2). Also fires when two queries in the repo compute the same-named metric with different filters.

**Why it bites.** Every unstated choice is resolved silently and differently by each person who reimplements the metric, and the disagreement surfaces months later as an argument about whose dashboard is right rather than as a bug. Google's SRE practice names the fields that must be pinned down, and they are exactly the ones people leave implicit: "Aggregation intervals: 'Averaged over 1 minute'. Aggregation regions: 'All the tasks in a cluster'. How frequently measurements are made: 'Every 10 seconds'. Which requests are included: 'HTTP GETs from black-box monitoring jobs'. How the data is acquired: 'Through our monitoring, measured at the server'." Their reason for standardising is the cost of not doing so: "so that you don't have to reason about them from first principles each time." The window choice alone can invert a conclusion — "even this apparently straightforward measurement implicitly aggregates data over the measurement window. Is the measurement obtained once a second, or by averaging requests over a minute? The latter may hide much higher instantaneous request rates in bursts." A metric that is defined only in code is a metric whose definition can drift with a refactor and never be noticed.

**Backing.** `source` — Google, *Site Reliability Engineering*, Chapter 4, *Service Level Objectives* — https://sre.google/sre-book/service-level-objectives/, sections "Indicators", "Aggregation" and "Standardize Indicators", quoted above. The SLI framing generalises directly: an SLI is "a carefully defined quantitative measure of some aspect of the level of service that is provided", and the same specification discipline applies to a product metric. The complementary requirement inside this file — that the denominator go in the name and that numerator and denominator be reported separately — is Deng and Shi, KDD 2016, Lesson 6 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf.

---

### Say which indicators are leading and which are lagging, and treat the link between them as a model that can break

**What it requires.** Label each metric on the scorecard by horizon. A *lagging* indicator is the outcome you actually care about, observable only after the fact — retention, renewal, revenue, churn. A *leading* indicator is something measurable now that is believed to predict it. The belief connecting them is an estimated relationship, not a definition, and it needs a date on it and a re-check.

**When it applies.** A weekly dashboard of engagement metrics standing in for a quarterly revenue number. A ship gate that reads only short-horizon metrics on a change whose intended effect is long-horizon. In review: any argument of the form "this went up, therefore retention will go up", where nobody can say when that relationship was last measured.

**Why it bites.** The relationship is not stable, and the mechanism that breaks it is user behaviour adapting to the very change you shipped. Google's team put a number-generating methodology behind this: "the short-term effect is not always predictive of the long-term effect, i.e., the final impact once the product has fully launched and users have changed their behavior in response." Their case study is ads blindness — "the phenomenon of users changing their inherent propensity to click on or interact with ads" — where a change can look positive on short-horizon click metrics while degrading the long-horizon quantity, because users learn. Their resolution is not to abandon short-horizon metrics but to *fit* the mapping: "we use these results to create a model that uses metrics measurable in the short-term to predict the long-term." A team that treats a leading indicator as if it were the outcome skips the fitting step entirely, and the divergence accumulates silently across launches — the leading indicator keeps rising, the lagging one does not, and by the time that is visible the attribution to individual launches is gone. This is the temporal companion of the proxy principle in §1: that one is about measuring the wrong *quantity*, this one is about measuring the right quantity at the wrong *time* and assuming the extrapolation holds.

**Backing.** `source` — Hohnhold, O'Brien and Tang (Google), *Focusing on the Long-term: It's Good for Users and Business*, KDD 2015 — https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43887.pdf, quoted above. Corroborating on the primacy/novelty mechanism that makes short-horizon readings unstable in the first place: Kohavi et al., KDD 2012, §3.3 — https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf (see also the novelty principle in `analysis.md`). On what disqualifies a leading indicator from being used at all: Deng and Shi, KDD 2016, Lesson 3 — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf — a metric with no established directionality "is disqualified to act as a goal metric".

---

### Goodhart's law: once a metric is what someone is judged by, it stops measuring what it measured

**What it requires.** Before a metric is attached to a person, a team, an OKR, or a bonus, ask the cheapest-path question: what is the least effortful way to move this number without moving the outcome it stands for? If a plausible answer exists, either the metric does not become a target, or it ships with a paired guardrail that the cheap path would break.

**When it applies.** The observable trigger is narrow and checkable: **a metric that someone's work is judged by, which they can move without moving the underlying outcome.** Concretely — an agent-performance dashboard on tickets closed per day (close them faster, unresolved); a bot-quality metric on containment rate (refuse to escalate); an activation metric on "accounts that completed setup" where the team also controls what counts as setup; any metric whose definition and whose target are owned by the same person.

**Why it bites.** This is not a claim about bad faith; the adaptation happens without anyone deciding to game anything, which is why it is invisible from inside. Goodhart's original 1975 formulation is about exactly that mechanism: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes." The version that travelled — Hoskin's phrasing, popularised by Strathern in 1997 — is the one to quote in a review: "When a measure becomes a target, it ceases to be a good measure", with her illustration that "the more a 2.1 examination performance becomes an expectation, the poorer it becomes as a discriminator of individual performances." The cost in a product setting is that the correlation between the metric and the outcome, which was real when the metric was chosen, decays *because* the metric was chosen — so the historical evidence that justified it stays on the record and stops being true. Everything downstream keeps reporting improvement. The failure surfaces only in the lagging indicator, quarters later, with no way to attribute it.

**Backing.** `source` — *Goodhart's law* — https://en.wikipedia.org/wiki/Goodhart%27s_law, which reproduces the original formulation from Goodhart's 1975 paper on UK monetary policy and Strathern's 1997 restatement (*'Improving ratings': audit in the British University system*, European Review 5(3), 305-321), both quoted verbatim above, along with Hoskin's 1996 phrasing "that every measure which becomes a target becomes a bad measure". The page also notes that Campbell's law "likely has precedence, as Jeff Rodamar has argued, since various formulations date to 1969". Neither primary text was retrievable — see "Sources I could not open or verify" below. The operational counterweight is already in §1 of this file: guardrail metrics exist precisely to make the cheap path visible, and Deng and Shi describe them as capturing "the dimensions of user experience that the goal metrics are not able to measure" — https://www.kdd.org/kdd2016/papers/files/adf0853-dengA.pdf.

---

## What changed

- **"One OEC to rule them all" has softened into "one OEC plus a declared guardrail set".** The 2009–2013 material pushes hard for a single overall evaluation criterion. Deng and Shi (KDD 2016, Lesson 7) concede that "finding a good goal metric that has both clear direction and actionable sensitivity can still be very hard because no metric is applicable in all scenarios", and recommend a combination of success-criteria metrics with known failure scenarios as a surrogate. Insisting on a single scalar for every experiment is no longer the recommendation; declaring the set and each member's failure mode is.
- **Trimming outliers is no longer a free hygiene step.** Capping is still recommended for skew and sensitivity (KDD 2014, Rule #7), but the filter must be treatment-independent: Dmitriev et al. (§5.9) show a bot-detection filter that removed real users *because* the treatment made them more engaged, producing both an SRM and a fake regression. "Standard outlier removal" applied after the fact is now a thing to inspect, not to assume.
- **Reporting a mean alone for latency and revenue has been displaced by quantiles.** The mean of a heavy-tailed distribution is both unstable and insensitive; the practical move is a capped mean or an explicit quantile with the cap stated.
- **Metric definitions have moved from tribal knowledge into declared specifications.** The SRE practice of standardising SLI templates — window, inclusion rule, acquisition method — is now the baseline expectation for any metric more than one team reads, and "it's whatever the query does" is no longer an acceptable definition.
- **Short-horizon metrics stopped being treated as free stand-ins for long-horizon ones.** Google's 2015 long-term work reframed the leading/lagging link as something to *fit and validate*, not assume; a scorecard that reports only short-horizon signals now owes an explanation of how they map to the outcome, and when that map was last checked.

## Sources I could not open or verify

- Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing* (Cambridge, 2020): only the landing page https://experimentguide.com/ was retrievable. No claim above is sourced to the book text.
- Kohavi and Thomke, *The Surprising Power of Online Experiments*, Harvard Business Review, September–October 2017 — https://hbr.org/2017/09/the-surprising-power-of-online-experiments: the fetch returned the title and byline only; the article body is paywalled. Nothing above is cited to it.
- No open, citable source was found that states the specific greedy-cap-by-volume failure in these terms. The final principle is assembled from a primary source for the estimator (Horvitz–Thompson) plus the selection-bias framing from the SRM literature; the application to a weekly analysis cap is marked `consensus`, not `source`.
- **Goodhart (1975), *Problems of Monetary Management: The U.K. Experience*.** The original paper is not available online in any form that could be opened. Its formulation is quoted **as quoted in** https://en.wikipedia.org/wiki/Goodhart%27s_law, which was retrieved in full and which carries the full bibliographic citation.
- **Strathern (1997), *'Improving ratings': audit in the British University system*, European Review 5(3), 305-321.** The Cambridge Core page is paywalled. An Internet Archive copy exists at https://archive.org/details/ImprovingRatingsAuditInTheBritishUniversitySystem, but the PDF is an image-only scan with no extractable text — the same failure mode already recorded for Benjamini and Hochberg (1995) in `analysis.md`. Her phrasing is therefore quoted **as quoted in** the Wikipedia article, which also attributes the wording upstream to Hoskin (1996). No claim above rests on text read directly from either primary source.
- **Chrystal and Mizen, *Goodhart's Law: Its Origins, Meaning and Implications for Monetary Policy* (2001)** was sought as a peer-reviewed secondary source for the original formulation. Every located host returned a paywall or HTTP 403. Not cited.
- **Kaplan and Norton's balanced-scorecard literature**, the usual origin cited for the leading/lagging vocabulary, is behind the HBR paywall and was not opened. The leading/lagging principle above is instead sourced entirely to Hohnhold, O'Brien and Tang (KDD 2015), whose PDF was opened and text-extracted; the terms "leading" and "lagging" are this layer's labels for the short-term/long-term distinction that paper makes.
