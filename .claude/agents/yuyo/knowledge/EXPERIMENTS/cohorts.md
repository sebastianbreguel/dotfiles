---
updated: 2026-08-16
ttl: 24 months
sources: 14
---

# Yuyo — Experiments: Cohorts and retention

**What this covers.** Analyses whose unit is a group of users defined by when they arrived or what they first did, then followed forward through time: retention tables, churn curves, activation rates by signup week, "the accounts that onboarded in March behave differently". Out of scope: comparing a treatment arm against a control inside a randomized test (`design.md`, `analysis.md`) and the definition of the quantity being tracked (`metrics.md`).

**The failure mode.** A cohort analysis is observational. Nothing was randomized, so every difference between two cohorts is the product change *plus* the season *plus* the acquisition mix *plus* how much elapsed time each cohort has had. The output is a curve that reads like a measurement and is actually four effects added together. Worse, the cells a reader looks at first — the newest cohorts, the ones describing the product as it exists today — are the cells with the least data and the most censoring, so the most-consulted numbers in the table are structurally the least trustworthy. The query succeeds, the chart renders, and the roadmap turns on it.

**Backing scale.** Same as the core file.

- **`source`** — paper, standard, or official documentation cited with a URL.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both named, one recommended, with the tradeoff.

---

## 1. Defining the cohort

### Write the cohort definition down: entry event, entry timestamp, and exit criteria

**What it requires.** Three things exist in writing before the query runs: the event that puts a user in the cohort (signup row created? first message sent? first paid invoice?), the timestamp that assigns them to a bucket, and the rule that removes them (deleted account, downgraded plan, test flag). "Users who signed up in March" is not a definition until you say which column, in which timezone, and whether a user who signed up twice counts once.

**When it applies.** Any query with `DATE_TRUNC('week', created_at)` or `GROUP BY signup_month` feeding a retention or activation number. The trigger is sharper when the entry column is ambiguous in the schema: `created_at` on the account row, `created_at` on the first contact, and the first billing event are three different March cohorts over the same customers.

**Why it bites.** The definition is the analysis. Product analytics tools make this explicit because they have to: Amplitude's retention numerator and denominator are both stated relative to a *starting event* and a *cohort entry date*, and Mixpanel buckets users by "when they first complete an action" — the birth event. Change the birth event from "signed up" to "sent first message" and every cohort loses its non-activating users, which is exactly the population whose retention is worst. The retention curve jumps, nothing in the code looks different, and the improvement is a definition change nobody wrote down. The reader has no way to detect this, because a cohort chart carries no metadata about what put people in it.

**Backing.** `source` — the numerator/denominator/entry-date decomposition: Amplitude Docs, *How the Retention Analysis chart calculates retention* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-calculation, which writes retention explicitly as `{# of users who triggered return event on exactly X days after cohort entry date} / {# of users who triggered start event on specific cohort entry date}`. The birth-event framing: Mixpanel Docs, *Retention: Measure engagement over time* — https://docs.mixpanel.com/docs/reports/retention: "Mixpanel groups unique users in time-incremented buckets when they first complete an action, and then groups those same users in subsequent buckets when they return and perform the same or different" action. The general form of the requirement — that an indicator is not specified until its window, its inclusion rule, and its acquisition method are written down — is Google's SRE standard for SLIs and is the same discipline applied to a different metric family: https://sre.google/sre-book/service-level-objectives/.

---

### A membership rule that depends on the future is a survivorship filter, not a cohort

**What it requires.** Cohort membership must be decidable using only information available at the entry timestamp. If the rule reads a fact that could only be known later — "users who completed onboarding", "accounts that reached 100 messages", "customers who renewed" — the group is defined by having survived, and every downstream survival number is circular.

**When it applies.** Observable as a join or subquery in the cohort definition that filters on an event *after* the entry date, or on a lifetime aggregate: `WHERE total_orders > 5`, `WHERE onboarding_completed_at IS NOT NULL`, `JOIN subscription s ON s.status = 'active'`. Also fires on the softer version — a cohort of "power users" whose power-user status was computed over the same window whose retention is being reported.

**Why it bites.** Time spent before qualifying is time during which the member could not have churned by construction, so it is credited to the treatment for free. The canonical demonstration is outside software: a study published in *Annals of Internal Medicine* found that Academy Award winners lived almost four years longer than their peers, and the method "credited winners' years of life before winning toward survival after winning. When the data were reanalyzed using methods that avoided this immortal time bias, the survival advantage was closer to one year and was not statistically significant." The product-analytics version is identical in shape and reads as an enormous, obvious win: users who completed onboarding retain far better than users who did not, therefore onboarding causes retention. It does not follow — the non-completers include everyone who churned before they could finish. The decision this makes wrong is a roadmap decision to invest in the qualifying step, and there is no downstream signal that contradicts it, because the metric keeps confirming itself.

**Backing.** `source` — *Survivorship bias* (which is where *immortal time bias* resolves) — https://en.wikipedia.org/wiki/Survivorship_bias, on the Redelmeier and Singh reanalysis quoted above; the article's general statement is that survivorship bias "results from concentrating on entities that passed a selection process while overlooking those that did not." The experimentation analogue already in this layer is the trigger-condition principle in `design.md`: comparing a self-selected slice of one group against the whole of the other measures the selection, not the effect.

---

## 2. Time, censoring, and the triangle

### Read the retention triangle down a column, and mark the incomplete cells

**What it requires.** In a cohort table — rows are entry periods, columns are periods-since-entry, so the filled region is a triangle — a comparison is only valid *within* a column. Cells where the cohort has not yet lived long enough must be excluded from every average and visually marked, not silently rendered as a number.

**When it applies.** Any `GROUP BY cohort_week, weeks_since_signup` pivoted into a table or heatmap. The trigger is the bottom rows: the newest cohorts, whose right-hand cells cover periods that have not finished. Also fires on the summary line — an "overall retention" row computed over a window whose tail is incomplete.

**Why it bites.** An incomplete cell is not a low number, it is a *not-yet* number, and treating it as a low number bends the curve in whichever direction the tool's denominator convention happens to point. Both major analytics vendors document this as a real, recurring misreading, in opposite directions. Mixpanel: the older, non-intervalized method "did not give all users an equal chance to qualify for the later retention buckets. Newer, more recent users to come into the query towards the end of your date range would not have enough time to pass to have the opportunity to be retained in the later date buckets. This would sandbag the last retention buckets in your query." Amplitude's convention drops those users from the denominator instead, which produces the opposite artifact: "when the analysis is still in progress, the graph can curve up and appear to increase over time. This happens because Amplitude excludes users who haven't yet reached later retention intervals from the denominator." A rising retention curve is the single most persuasive chart in a product review, and this is a way to draw one out of a flat product. In hand-rolled SQL, where there is no vendor convention at all, whichever artifact you get is an accident of how the join was written.

**Backing.** `source` — Mixpanel Docs, *Retention* — https://docs.mixpanel.com/docs/reports/retention (intervalized retention, "so that all users have the same opportunity to be retained"). Amplitude Docs, *How the Retention Analysis chart calculates retention* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-calculation, which additionally marks incomplete cells with an asterisk and excludes them from the all-users row: "Amplitude excludes incomplete data from the All Users totals (incomplete cells have an asterisk)."

---

### Users who have not churned yet are censored, not retained — use a survival estimator

**What it requires.** When the question is "how long do accounts last", the still-active accounts are *right-censored*: their observed duration is a lower bound on their true lifetime, not the lifetime. They must enter the estimate as censored observations — Kaplan-Meier or an equivalent — rather than being dropped or averaged in at their current age.

**When it applies.** Any `AVG(churned_at - created_at)` or `AVG(NOW() - created_at)` over accounts. Any "average customer lifetime" or LTV denominator. Any dashboard reporting a median tenure. The trigger is a duration aggregate over a table where some rows have no end date.

**Why it bites.** Both naive fixes are biased in the same direction, and it is the flattering direction only when you want lifetimes to look short. The lifelines documentation walks it: with two hidden subpopulations, one short-lived and one long-lived, observed at t = 10, "if we are asked to estimate the average lifetime of our population, and we naively decided to *not* include the right-censored individuals, it is clear that we would be severely underestimating the true average lifespan" — because the only completed lifetimes belong to the users who died fast. And the apparent repair fails too: "if we instead simply took the mean of *all* lifespans, including the current lifespans of right-censored instances, we would *still* be underestimating." Its verdict on the common shortcut is flat: "A common mistake data analysts make is choosing to ignore the right-censored individuals." The consequence in a product setting is a systematically understated customer lifetime, which flows straight into LTV, into payback period, and into a decision about how much a customer is worth acquiring.

**Backing.** `source` — lifelines documentation, *Introduction to survival analysis* — https://lifelines.readthedocs.io/en/latest/Survival%20Analysis%20intro.html, quoted above; survival analysis exists specifically "to deal with estimation when our data is right-censored". Definition of the condition: *Censoring (statistics)* — https://en.wikipedia.org/wiki/Censoring_(statistics), "a condition in which the value of a measurement or observation is only partially known". The estimator: *Kaplan–Meier estimator* — https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator — "An important advantage of the Kaplan–Meier curve is that the method can take into account some types of censored data, particularly right-censoring, which occurs if a patient withdraws from a study, is lost to follow-up, or is alive without event occurrence at last follow-up." The same page explains why the obvious alternative is worse: a naive estimator that conditions only on subjects observed past *t* "ignores all the observations whose censoring time precedes *t*", discarding real information about survival.

---

### N-day, on-or-after, and rolling retention are three different metrics — say which one

**What it requires.** "Day 7 retention" is ambiguous and must be disambiguated in the metric's name and in the query: returned *on* day 7, returned *on or after* day 7, or returned *at any point within* days 1-7. The same ambiguity applies to what a "day" is — a rolling 24-hour window from the user's entry, or a calendar date in some timezone.

**When it applies.** Any retention query, and specifically the `WHERE` clause that selects the return event: `= day_7` versus `>= day_7` versus `BETWEEN day_1 AND day_7`. Also: `DATE_TRUNC('day', event_at)` (calendar, timezone-dependent) versus `event_at - entry_at >= interval '7 days'` (rolling window). And any comparison of a number from a vendor dashboard against a number from a hand-written query.

**Why it bites.** These definitions produce materially different numbers over the same events and all three are called "retention", so two teams can disagree about whether retention improved while both being arithmetically right. Amplitude names the two dominant variants explicitly — Return On ("the percentage of users that came back to trigger your return event on a specific day") and Return On or After ("the percentage of users who returned seven days or more after their first use") — and the second is monotonically larger than the first by construction. The day boundary compounds it: Amplitude's default treats a day as "a rolling 24-hour window ... which is different for each user", where "Day 1 runs from hour 24 to hour 48", while the strict-calendar option makes retention depend on "the timezone specified in your project settings". A user who returns four hours after signing up is Day Zero retained under one and next-day retained under the other. Reconciling a dashboard number against a SQL number then costs a day of investigation and usually ends with someone deciding the SQL is wrong.

**Backing.** `source` — Amplitude Docs, *Interpret your retention analysis* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-interpret (Return On vs Return On or After, formerly N-Day and Unbounded). Day-boundary semantics: Amplitude Docs, *How time works in a retention analysis* — https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-time. Mixpanel documents the same split as rolling versus calendar interval mode and ties it to who is asking: https://docs.mixpanel.com/docs/reports/retention.

---

## 3. Comparing cohorts

### Do not pool cohorts of unequal size into one average without weighting

**What it requires.** A headline retention number computed across cohorts is a weighted average, and the weights are the cohort sizes. Write them into the query. An unweighted mean of per-cohort rates, or a pooled numerator over a pooled denominator, are two different numbers and neither is automatically the one you want.

**When it applies.** `AVG(retention_rate)` over a set of per-cohort rates. A single "overall retention" figure over a window that contains a marketing spike, a launch, or a seasonal trough. Any month-over-month cohort comparison where the months differ in acquisition volume.

**Why it bites.** This is where Simpson's paradox lives in product analytics: "a trend appears in several groups of data but disappears or reverses when the groups are combined". The mechanism in the canonical UC Berkeley admissions case is exactly the cohort case — men were admitted at 44% overall and women at 35%, not because any department preferred men but because women disproportionately applied to departments with lower acceptance rates for everyone; the aggregate reversed the per-department picture. Substitute "cohort" for "department" and "acquisition channel" for "applicant" and you have a paid-acquisition spike in one month dragging a pooled retention number down while every individual cohort improved. The pooled number is arithmetically correct, has the largest sample size in the room, and points the wrong way. Mixpanel resolves it by weighting explicitly — its Average row "takes the average of all the completed buckets, weighted by the number of users who enter" — which is worth copying precisely because the unweighted version is the natural thing to type.

**Backing.** `source` — *Simpson's paradox* — https://en.wikipedia.org/wiki/Simpson%27s_paradox, definition and the UC Berkeley admissions example. Weighted aggregation as the standard remedy in a retention product: Mixpanel Docs — https://docs.mixpanel.com/docs/reports/retention. The experiment-side statement of the same failure is already in `metrics.md`: Crook, Frasca, Kohavi and Longbotham, KDD 2009, Pitfall 4 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf — who note these reversals "are unintuitive, [but] they are not uncommon, and we have seen them happen multiple times in real life."

---

### A cohort comparison isolates nothing on its own — name the other things that changed

**What it requires.** Before attributing a difference between two cohorts to a product change, list what else differs between their entry windows: acquisition channel mix, price or plan changes, seasonality, competing launches, the amount of elapsed time each has had. If the list is non-empty and unaddressed, the finding is a hypothesis for an experiment, not a result.

**When it applies.** Any write-up of the form "cohorts after the March release retain better". Observable in code as a comparison of two `WHERE signup_month = ...` slices with no covariate held fixed, and no equivalent-period reasoning. Also: a "we shipped X and retention went up" claim where X shipped in the same week as a pricing change or a campaign.

**Why it bites.** Cohorts are not randomized, so the comparison has no protection against confounding at all — it is a before/after with extra steps, and the layer's existing rule against comparing non-equivalent periods applies in full. The specific trap is that a cohort chart *looks* controlled: the two curves are aligned on a common x-axis of weeks-since-signup, which visually removes calendar time and creates the impression that time has been controlled for. It has not; only *elapsed* time has been aligned, while *calendar* time, and everything that varied with it, is still fully confounded. And the two cohorts do not even have the same amount of data — the later one is truncated, which is the censoring problem above compounding this one. The result is a causal claim about a release, made from a chart that cannot support one, in a review where the chart is the most sophisticated artifact on the screen.

**Backing.** `source + consensus` — the period-equivalence requirement and its remedies (paired comparison over stable periods, weighting, or discarding the ramp): Crook, Frasca, Kohavi and Longbotham, *Seven Pitfalls to Avoid when Running Controlled Experiments on the Web*, KDD 2009, Pitfall 4 — https://exp-platform.com/Documents/2009-ExPpitfalls.pdf. The selection-bias framing — that a mismatch between the population you meant to describe and the population you measured invalidates causal inference rather than merely qualifying it — is Fabijan et al., KDD 2019, §4.2 — https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf. The escalation to "run an experiment instead" is `consensus`: no cited paper prescribes it for cohort work specifically, but it is the direct consequence of there being no randomization to lean on.

---

## What changed

- **Product-analytics vendors now document the incomplete-cohort artifact as a first-class correctness issue, not a footnote.** Mixpanel changed its default to intervalized retention specifically so that "all users have the same opportunity to be retained", and Amplitude marks incomplete cells and excludes them from totals. Hand-written SQL has no such default, so a retention query written from scratch is *more* likely to carry the bug than one built in a tool — which inverts the usual assumption that the bespoke query is the careful one.
- **"N-day retention" is no longer a self-explanatory term.** Amplitude renamed its two variants to Return On and Return On or After precisely because N-Day and Unbounded were being confused. Any metric named "D7 retention" with no further qualification should be treated as underspecified rather than conventional.
- **Survival analysis is no longer specialist tooling.** Right-censoring used to be handled by dropping incomplete rows because the estimators were awkward to reach; open implementations (lifelines) make Kaplan-Meier a few lines, so `AVG(churned_at - created_at)` is now a choice rather than a constraint.

## Sources I could not open or verify

- **Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments* (Cambridge, 2020).** As across the rest of this layer: only the landing page https://experimentguide.com/ is retrievable. Nothing here is sourced to the book text.
- **Redelmeier and Singh (2001), *Annals of Internal Medicine*, and the Sylvestre et al. reanalysis.** Both are described **as described inside** the Wikipedia survivorship-bias article, which was opened — https://en.wikipedia.org/wiki/Survivorship_bias. The original papers were not fetched, and the immortal-time-bias claim above should be read at that remove.
- **Immortal time bias has no standalone reference page.** https://en.wikipedia.org/wiki/Immortal_time_bias redirects to *Survivorship bias*, which covers it in one paragraph. No dedicated open primary source (e.g. Suissa's epidemiology papers) was retrieved, so the principle is stated from the general survivorship framing plus the one worked example.
- **Vendor documentation is a primary source for that vendor's semantics only.** The Amplitude and Mixpanel pages cited above are authoritative for how those products compute retention. They are not neutral statistical references, and where they are used above it is deliberately for definitional facts ("these are three different metrics", "incomplete cells are excluded") rather than for statistical claims.
