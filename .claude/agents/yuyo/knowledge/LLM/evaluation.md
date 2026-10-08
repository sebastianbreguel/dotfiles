---
updated: 2026-08-16
ttl: 6 months
sources: 9
---

# Yuyo — LLM / Evals and LLM judges

**What it covers.** Success criteria, cheap assertions before a judge, volume versus hand grading, eval sets that measure what fails, judge calibration against human labels, position and length bias, judge and evaluated sharing a model, anchored rubrics, rubric versioning, judge configuration and dispersion, what the judge is allowed to see, and paired comparison.

**When to read it.** When the diff introduces or changes a grader, a rubric, an eval case file, a CI quality gate, or a score that feeds a dashboard or a product decision. Always after `CORE.md`.

> This section has almost no local precedent: the team's review corpus does not discuss evals or judge calibration. The backing is `source`, and that is why findings here are raised by explaining the mechanism, not by invoking precedent. It is also where the marginal value is highest.

**Identifiers.** Entries in this file are cited as `E<n>`. Cross-file references name the file (`output.md` B7, `operations.md` H1, `NLP/text.md` TX10).

---

## E1. Define specific, measurable success criteria before writing the eval

**What it requires.** Criteria are specific, measurable, achievable and relevant, and even the fuzzy ones get quantified. Almost every real case needs multidimensional evaluation: task fidelity, consistency, relevance, tone, privacy, context use, latency and price.

**When it applies.** A ticket that says "improve response quality" without defining what is measured. A new eval whose correctness criterion is not written down anywhere.

**Why it bites.** With no criterion there is no eval, and with no eval every prompt change is a bet (C3). A vague criterion gets resolved differently on every run and in every discussion, so the team ends up arguing about what "better" means instead of about whether it got better.

**Backing.** `source` — Anthropic, *Define success criteria and build evaluations* — https://docs.claude.com/en/docs/test-and-evaluate/develop-tests. The doc's verbatim example: "Less than 0.1% of outputs out of 10,000 trials flagged for toxicity by the content filter" (good) versus "Safe outputs" (bad).

---

## E2. Start with cheap assertions; every code-verifiable criterion leaves the rubric

**What it requires.** The first level of evaluation is unit-test-style assertions: fast, cheap, runnable on every change. Every criterion decidable by code — the JSON parses, the cited id exists, the number matches, the required field is present, the format is the one requested — is verified with code and removed from the judge's rubric.

**When it applies.** A rubric that includes criteria like "the response is in a valid format", "it mentions the right product" or "the calculation is correct". LLM judge infrastructure set up before deterministic assertions exist.

**Why it bites.** The judge gets the verifiable things wrong — it says the JSON is fine when it does not parse — and that error contaminates the composite score, so a format failure can no longer be distinguished from a content failure. Every verifiable criterion delegated to the judge adds free variance to a measurement that needed to be stable, and costs one call per case.

**Backing.** `source + evidence`.
- `source` — Hamel Husain, *Your AI Product Needs Evals* — https://hamel.dev/blog/posts/evals/: the first level is assertions runnable on every code change; the second, human and model-based evaluation; the third, A/B testing in production. Many real failures are verifiable with deterministic code: did it return exactly one result? does the UUID appear in the response? does the total add up?
- `evidence` — "esto podria ser deterministico?" — PR #4171 (BE) (Lucas), cited in C1.

---

## E3. Prefer volume of automated cases over few cases with human grading

**What it requires.** Structure the questions so they can be graded automatically (multiple choice, string match, code, or LLM judge) and prioritize quantity over annotation perfection.

**When it applies.** An eval with 20 hand-reviewed cases where each run takes an afternoon.

**Why it bites.** That eval is not going to run on every PR, and an eval that does not run does not exist. Annotation quality does not compensate for lack of resolution: with a small n, the difference between two variants is noise (C8).

**Backing.** `source + debated` — Anthropic, *Define success criteria and build evaluations*: "More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals" — https://docs.claude.com/en/docs/test-and-evaluate/develop-tests.
- *Position B:* some prioritize annotation quality over volume, especially when the judge is poorly calibrated — and with an uncalibrated judge (E5), more cases only produce more meaningless numbers. **Recommendation:** volume with automatic grading, with judge calibration as a prerequisite. **Tradeoff:** lower signal per case in exchange for an eval that actually runs.

---

## E4. The eval has to measure what fails, not what already works

**What it requires.** The set is deliberately composed of the failure modes observed in production — ambiguity, missing information, angry customer, odd format, mixed language, irrelevant input, overly long input — and not of the happy path that always passes. It includes at least one case where the correct answer is "I do not have that information".

**When it applies.** The new case file is homogeneous: same language, same length, same intent, all resolved. An eval added for a new feature with no abstention case at all.

**Why it bites.** The eval hits 95 % on day one and stays there forever: it has no resolution to distinguish a good change from a bad one because every case passes under both. It stops being an instrument and becomes a ritual — it is expensive to run, nobody looks at it, and when something breaks in production it still reads 95 %.

**Backing.** `source + evidence`.
- `source` — Anthropic, *Define success criteria and build evaluations*: deliberately include edge cases (irrelevant, too long, poor, ambiguous input) — https://docs.claude.com/en/docs/test-and-evaluate/develop-tests.
- `evidence` (partial) — the abstention case was explicitly requested in PR #12338 (BE) (Lucas), cited in `retrieval.md` D4: that abstention is specified implies it is also evaluated.

---

## E5. Calibrate the judge against human labels and report the agreement

**What it requires.** Before a judge's score is used to make decisions, somebody hand-labels a set of cases and the agreement between judge and human is reported. Without that number, the judge measures something unknown.

**When it applies.** The diff introduces a new grader, or changes an existing rubric, and the score starts feeding a dashboard, a CI gate or a product decision, with no human label set it has been measured against.

**Why it bites.** The system gets optimized against the judge instead of against quality: the prompt learns to produce what the judge rewards, the metric goes up and the customer experience does not change or gets worse. Since the judge is the only source of truth, there is no internal signal that contradicts the apparent improvement. It is discovered when somebody reads real conversations and does not recognize the number.

**Backing.** `source` — Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, arXiv:2306.05685 — https://arxiv.org/abs/2306.05685: the result that legitimized the LLM judge is "over 80% agreement" with human preferences, "the same level of agreement between humans" — but that number is the conclusion of a calibration experiment, not an inheritable property. Important caveat: a later study over 11 judges and 20 tasks found high variance in the correlation with human judgment depending on the dataset, and that judges correlate better with **non-expert** annotators than with experts, which suggests several high-correlation reports are inflated — reviewed in Eugene Yan, *Evaluating the Effectiveness of LLM-Evaluators* — https://eugeneyan.com/writing/llm-evaluators/. Which agreement metric to use is debated (exact, ±1 on an ordinal scale, Cohen's kappa) and how many cases suffice; that you have to calibrate is not. The family of agreement coefficients is in `NLP/text.md` TX10.

---

## E6. Neutralize position bias and length bias

**What it requires.** If the judge compares two responses, run it in both orders and average; if the verdict flips, the pair is undecidable and counts as a tie. If the judge scores a single response, the rubric explicitly says that length is not a criterion.

**When it applies.** A comparative judge (A vs B in the same prompt) with no position swap. A rubric that rewards "completeness", "detail" or "thoroughness" with no counterpart penalizing filler.

**Why it bites.** The ranking can be hacked by changing the order of appearance: the published extreme case is a model beating another on 66 of 80 queries purely by manipulating the order. And the judge systematically prefers the longer response, so the system converges toward long answers that score high and that annoy the customer: the metric goes up while the experience gets worse, and since the metric is what people look at, the correction takes months.

**Backing.** `source` — Wang et al., *Large Language Models are not Fair Evaluators*, arXiv:2305.17926 — https://arxiv.org/abs/2305.17926, which proposes three mitigations: ask for evidence before the score (Multiple Evidence Calibration), aggregate results over several orders (Balanced Position Calibration), and human-in-the-loop for hard cases. The same bias is listed in the abstract of Zheng et al. (arXiv:2306.05685) along with verbosity bias and self-enhancement bias. It is one of the few biases with a cheap, agreed-upon mitigation.

---

## E7. Do not use the same model as judge and as evaluated

**What it requires.** When generator and judge share a family, the PR declares it and attaches the calibration against human labels. Where possible, the judge is from another family.

**When it applies.** The diff introduces a grader that uses the same model identifier as the call that produces the evaluated output. Very easy to introduce accidentally when "upgrading everything to the new model".

**Why it bites.** Self-preference bias makes the model score its own style higher, and the system gets measured against a judge that shares its blind spots: the error the generator makes by misreading an instruction is exactly the one the judge does not see. The metric ends up systematically optimistic and there is no way to detect it from the inside.

**Backing.** `source + debated` — Panickssery, Bowman and Feng, *LLM Evaluators Recognize and Favor Their Own Generations*, arXiv:2404.13076 — https://arxiv.org/abs/2404.13076: models recognize their own outputs with non-trivial accuracy and there is "a linear correlation between self-recognition capability and the strength of self-preference bias", with causal evidence in controlled experiments.
- *Position B:* with a very specific rubric the effect is smaller than the quality loss of using a weaker judge from another family; there is no canonical mitigation protocol.
- **Recommendation:** a different family when the capability gap is small; otherwise, the same model but with mandatory human calibration and no comparing scores between systems evaluated by different judges. **Tradeoff:** a judge from another family adds one more dependency and one more failure mode.

---

## E8. A rubric without anchored examples produces variance across runs

**What it requires.** Every level of the scale has a concrete example. If a criterion ends up with an empty example list, the criterion is not ready to be used.

**When it applies.** The diff generates or adapts rubrics and post-processing can leave `examples_good: []` or equivalent; or the hand-written rubric defines levels only with adjectives ("good response", "acceptable response").

**Why it bites.** Without anchors, "good" is defined by the model on every call: the same conversation scores 4 today and 3 tomorrow, and the run-to-run noise becomes larger than the effect being measured. Every subsequent A/B is invalidated and nobody knows why the numbers do not add up.

**Backing.** `evidence` — PR #13095 (BE), `ai-rubric-generation.service.ts` (Panda), cited in C12: there the finding reads as silent degradation in post-processing; here it reads for its effect on judge stability.

---

## E9. The rubric is versioned and the score records which version produced it

**What it requires.** Every persisted score carries the version of the rubric that produced it. A change in a criterion's description is a change of the unit of measurement (C15).

**When it applies.** The diff edits a criterion's text or its anchors and the old scores stay in the same table or dashboard with no version discriminator. Additional signal: the regeneration flow rewrites every anchor when only one description was touched (`output.md` B7).

**Why it bites.** The time series mixes two units: the "quality jump" of March 12 is the date somebody reworded a criterion. Worse when the rewrite is implicit — a description is edited, the pipeline regenerates all five anchors, and the criterion ends up measuring something different without the diff showing it.

**Backing.** `evidence` — PR #13279 (BE), `ai-rubric-plan.schema.ts` (Panda), quoted verbatim in `output.md` B7. Explicit versioning of the score is `consensus`.

---

## E10. Fix the judge's configuration and run it n times when it matters

**What it requires.** The judge call uses the most deterministic configuration available and a stable template. For important decisions it is run several times and the dispersion is reported, not a single run.

**When it applies.** A grader that inherits the client's default temperature; a judge prompt built by concatenating pieces whose order depends on object iteration.

**Why it bites.** Two runs over the same dataset give different numbers. The team cannot distinguish "the change improved things by 2 points" from "the judge varied by 2 points", and the discussion is settled by whoever talks loudest. The real cost is not the number: it is that the ability to decide is lost.

**Backing.** `source + consensus` — measured dispersion is the only proof of stability; minimum temperature reduces variance but does not eliminate it (`output.md` B10). The statistical framework for reporting it is in Miller, *Adding Error Bars to Evals*, arXiv:2411.00640 — https://arxiv.org/abs/2411.00640 (the abstract was read, not the body).

---

## E11. The judge has to see the same text the user saw

**What it requires.** If the judge's input is truncated, the truncation is explicit, uniform and documented as part of the criterion.

**When it applies.** The diff adds a `slice`, a `substring` or a character limit over what enters the grader, or passes a conversation summary instead of the conversation.

**Why it bites.** Long responses get judged by their first half. An error that appears at the end — an incorrect promise, an invented figure in the closing — is invisible to the judge systematically, not randomly: always the same type of failure, always in the riskiest responses. The eval goes blind exactly where it matters most.

**Backing.** `evidence` — "aca podemos hacer el slice al output" — PR #9629 (BE), `src/insights/modules/evals/graders/llm-rubric.grader.ts` (Max). **Honesty note:** the quote asks for truncation by size; that this truncation becomes part of the criterion and has to be treated as such is an extension, not the reviewer's claim. The request to truncate still stands (C16).

---

## E12. Do not declare a winner without a paired comparison

**What it requires.** Before claiming a variant is better, report the count of cases where it wins, loses and ties over **the same cases**, plus some measure of uncertainty.

**When it applies.** The PR compares two configurations with a single aggregate number per side and concludes. Or the eval runs once per variant.

**Why it bites.** The variant that won by noise gets merged. The real effect is zero or negative and, since victory was already declared, the next contradictory result is attributed to something else. Paired comparison is what contributes the most signal and is almost never done.

**Backing.** `source + debated` — Miller, *Adding Error Bars to Evals*, arXiv:2411.00640 — https://arxiv.org/abs/2411.00640, which treats eval questions as a sample from an unobserved superpopulation and gives formulas for measuring differences between two models and planning the experiment.
- *Position B:* significance tests give false precision over eval datasets that are not random samples of the real population; better a practical threshold ("it improves if it wins in 20 more cases than it loses").
- **Recommendation:** paired comparison over the same cases plus explicit wins/losses/ties, and bootstrap only if the decision is expensive. **Tradeoff:** full rigor slows down decisions that are reversible anyway. The equivalent for classification (repeated splits) is in `ML/evaluation.md`, and statistical power in `NLP/text.md` TX11.

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- For several arXiv papers, the **abstract and metadata** were read, not the full body. Where a practice depends on a detail that only exists in the body, it is flagged in the entry itself (this happens in *Adding Error Bars to Evals*, E10 and E12).
- **OpenAI's evals guide** (https://platform.openai.com/docs/guides/evals) was consulted but is not cited for specific content.
- **A Survey on LLM-as-a-Judge**, arXiv:2411.15594 (https://arxiv.org/abs/2411.15594): the abstract page was opened, no specific content is cited and the authors are not verified.
