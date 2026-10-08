---
updated: 2026-08-16
ttl: none
sources: 20
---

<!-- ttl is none on purpose: if a core principle goes stale, it means it was wrong, not that it got old. -->

# Yuyo — Core

**What it covers.** The principles that hold equally in classical NLP and in LLM-based systems: baseline before complexity, measurement before assertion, threshold calibration, error in both directions, data correctness, and the ways a model-based system fails silently. There are few of them, and they are the ones that most often decide whether a change can be merged.

**When to read it.** Always. This file is read in full on every review, no matter what the diff touches. Then load the specialty that applies:

- `LLM/` — prompts, structured output, tool use, agents, RAG, LLM judges, injection and model security, cost per token, inference latency, call observability. Entry point: `LLM/INDEX.md`.
- `NLP/` — encoding and Unicode, tokenization and segmentation, representations (TF-IDF, embeddings, similarity, thresholds), text search, NLP metrics and multilingual work. Entry point: `NLP/INDEX.md`.
- `ML/` — classification and splits, clustering and topic modeling: everything that works on a feature matrix and knows nothing about language.

**Backing scale.** A single principle can carry two levels; `source + evidence` is the strongest possible.

- **`source`** — there is official documentation, a paper or a standard cited with a URL. It can be stated as a verifiable fact and the author can go read it.
- **`evidence`** — a senior reviewer on this team asked for it in a concrete PR, with a verbatim quote. It is local precedent and can be held as a blocker.
- **`consensus`** — widely accepted practice, with no single citable source and no local precedent. Stated as a strong recommendation.
- **`debated`** — there is no agreement. Both positions are named and a recommendation is given with its tradeoff. Never stated as a blocker.

A URL is never invented and a level is never raised without real backing. If the local quote says something similar but not exactly the same, the difference is declared inside the principle itself.

**How to use it.** Every principle has an observable trigger. If the trigger is not in the changed lines, the principle does not apply and is not mentioned. When the diff touches several things, the severity order is: (1) what reaches the user being false while looking true; (2) what executes with side effects and should not; (3) what degrades without anyone counting it; (4) what costs more than it should; (5) what can be fixed later without migrating anything. A level-4 or level-5 finding does not take up space in a review that has an unresolved level-1 finding.

---

## C1. A simple baseline before accepting complexity

**What it requires.** Before accepting a model, an agent or an LLM call, the question is whether the problem is not solved by a rule, a query, a TF-IDF plus a linear classifier, or a `switch`. If the PR introduces the expensive path, the cheap baseline has to be in the report, with its number next to it.

**When it applies.** A prompt whose text contains arithmetic, an explicit boolean condition or a closed enumeration of cases. An output schema that is a single enum of two or three values derivable from columns the code already has in memory. A notebook or PR that reports a model's metric without the "TF-IDF + LogisticRegression" row. An agent loop over a flow of steps that can be drawn in advance.

**Why it bites.** The expensive path does not fail: it gets it right 96 % of the time and in the remaining 4 % it produces a plausible but wrong value, with no exception, no log, and passing type validation. It is discovered weeks later through an accounting discrepancy or a complaint. And without a baseline the complex model's number is evidence of nothing: it may be tying with two lines of scikit-learn that train in seconds.

**Backing.** `source + evidence`.
- `evidence` — "esto podria ser deterministico?" — PR #4171 (BE), `src/insights/graph-insights/calculate-annotation/prompts/build-calculate-annotation-prompt.ts` (Lucas), about a prompt that asked for a calculation with fixed rules.
- `source` — Anthropic, *Building effective agents*: "we recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all" — https://www.anthropic.com/engineering/building-effective-agents. Joulin et al., *Bag of Tricks for Efficient Text Classification*, arXiv:1607.01759 — https://arxiv.org/abs/1607.01759 (linear over bag-of-n-grams at a small distance from far more expensive architectures). The concrete instrument is in `NLP/representations.md` RP1.

---

## C2. Look at the raw data before the metric

**What it requires.** Before discussing which metric to use, somebody has to have read a real sample: full conversations, traces, dataset rows. A PR that proposes a metric or a model without anyone having looked at this week's data is optimizing blind.

**When it applies.** A dashboard with an aggregate number and no tool to open an individual case. A new dataset that enters training or an index without a manual review of random rows. A ticket that says "improve quality" without a single example attached.

**Why it bites.** The defects that cost the most do not show up in the aggregate: mojibake in 3 % of the rows, a customer who copies templates and generates duplicates, a misrouted language, a class that is really three. All of them move the metric barely at all and break the entire product for a subset. A review of 200 random rows costs minutes and detects what the average never detects.

**Backing.** `source + consensus`.
- `source` — Hamel Husain, *Your AI Product Needs Evals*: "You must remove all friction from the process of looking at data" — https://hamel.dev/blog/posts/evals/. For the dirty-data side, the specific mojibake tool: `ftfy` — https://ftfy.readthedocs.io/en/latest/.

---

## C3. No change of model, prompt, features, threshold or retrieval without a before/after comparison

**What it requires.** Every diff that can move quality comes with the same batch of cases run before and after. This holds for a prompt string, a model identifier, a threshold, the retrieval `k`, the chunking strategy, a new feature, a tokenizer change or a change of embedding library. Without that, the PR asserts an improvement nobody measured.

**When it applies.** The diff changes a prompt, a model literal, a deciding numeric constant (`THRESHOLD`, `TOP_K`, `MAX_TOKENS`), the function that builds the context or the feature set, and the description says "improves", "tunes" or "fixes" with no table, no eval artifact and no link to a run. Special case: the model identifier becomes a floating alias (`…-latest`), which means the behavior change will happen with no diff at all.

**Why it bites.** The new model is better on average and worse on your case: it changes the default format, becomes more verbose, stops emitting an optional field, or interprets differently an instruction that used to work by accident. Prompts are not portable across generations either. The regression ships to production, degrades a class of cases the author did not have in mind, and by the time the report arrives other changes have been merged on top and it cannot be attributed to this diff.

**Backing.** `source + evidence`.
- `evidence` — model choice by intuition was objected to twice: "mal modelo igual, hoy otros mejores calidad precio" — PR #11237 (BE), `meeting-insights.service.ts` (Max); "es piola ese modelo, es al ojo?" — PR #7510 (BE), `meeting-group-analysis.service.ts` (Max). In both cases the reviewer had nothing to compare against because the PR carried no comparison.
- `source` — Anthropic, *Prompting best practices*, "Migration considerations" section: prompts written to correct tool undertriggering in old models now cause overtriggering — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices.

---

## C4. Every threshold is calibrated with labeled data and recalibrated when the model changes

**What it requires.** A deciding number (similarity, confidence, score, classification cutoff) comes from looking at the score distribution over labeled cases and picking the point that respects the cost of each error. Not from a round number. And it is recalibrated every time the model that produces the score changes.

**When it applies.** A bare literal in a condition: `if (score > 0.85)`, `if (distance < 0.2)`, `confidence >= 0.9`. A threshold that survives a change of provider or of embedding model version. Inverted comparators between two functions working on the same index, a sign that nobody is clear on whether the metric is distance (smaller is better) or similarity (larger is better).

**Why it bites.** An eyeballed threshold ends up either so high that almost nothing passes — the system answers "I found nothing" all the time — or so low that it filters nothing and the noise gets in anyway. In both cases the number looks reasonable in the diff. Worse: the absolute value of a cosine similarity is not transferable across models, and contextual representations are anisotropic (they occupy a narrow cone of the space), so two random vectors already have a high cosine. With the comparator inverted, the system returns exactly the least relevant results and keeps working without errors.

**Backing.** `source`.
- `source` — Steck, Ekanadham and Kallus, *Is Cosine-Similarity of Embeddings Really About Similarity?*, arXiv:2403.05440 — https://arxiv.org/abs/2403.05440 (they derive that cosine similarity "can yield arbitrary and therefore meaningless similarities" depending on regularization). Anisotropy: Ethayarajh, EMNLP-IJCNLP 2019 — https://aclanthology.org/D19-1006/. The concrete calibration (precision-recall curve over labeled pairs) is in `NLP/representations.md` RP6.
- **Honesty note.** The local reflex of "is this eyeballed?" exists (PR #7510, Max), but that quote is about model choice, not thresholds. The parallel is an extension, not the reviewer's claim: it is not cited as precedent for thresholds.

---

## C5. A detector, guard or classifier is evaluated in both directions of the error

**What it requires.** A regex, a term list, a similarity threshold or a classifier that decides to block or pass arrives with the concrete cases it misclassifies today, in both directions and with the exact text, and with symmetric coverage across the languages and formats the product actually receives. Plus a production counter of how often it blocks. An aggregate accuracy over imbalanced classes substitutes for none of this.

**When it applies.** A new or modified pattern in an input or output guard; a character class that defines where a value is cut; a pattern defined for one language when the system serves two; any function that returns `safe`/`unsafe`, `match`/`no match`. On the metrics side: a positive-class prevalence below ~10 % together with a reported ROC-AUC above 0.9, or a single F1 figure without saying which averaging it uses.

**Why it bites.** The two sides hurt differently and the aggregate number is identical in both scenarios: a guard with 99 % accuracy over a class that occurs in 1 % of cases may be blocking everything good or blocking nothing. False positive: a legitimate tracking code matches the IBAN pattern, the message is blocked, the user sees not an error but silence, and the drop shows up as lost conversion that no chart connects to the guardrail deploy. False negative: the same number with spaces passes through intact, and nobody reports what happened when it should not have. Asymmetry across languages produces the worst case: it is validated in Spanish, deployed globally, and half the traffic is left unprotected with the metrics green.

**Backing.** `source + evidence`.
- `evidence`, the best-backed criterion in the local corpus (14 quotes from the same reviewer, always with the concrete case attached) — "**Falso positivo grave: este patrón de IBAN es demasiado laxo y bloquea tracking codes / guías / SKUs / cupones**" and "**Falso negativo: cuentas en formato `N° …` no se detectan**" — PR #11516 (BE), `bank-data-hallucination.guard.ts` (Panda); "sacaría esta. va a dar mucho FP […] ej que me saltó como fp '¡Gracias, Alex! [emoji] Ahora necesito continuar con el proceso…'" — PR #12612 (BE), `thinking-tag-leak.guard.ts` (Panda); "la cobertura EN quedó asimétrica respecto a ES" — PR #12852 (BE) (Panda).
- `source` — Saito and Rehmsmeier, *The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets*, PLOS ONE 2015 — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432.

---

## C6. Data correctness before model correctness

**What it requires.** Before believing any number, the data has to be right: test rows excluded, per-client isolation verified, near-duplicates detected, and joins that do not multiply rows. A well-trained model over a leaking dataset produces an excellent metric and a broken product.

**When it applies.** Raw SQL or query builder over tables that receive eval writes without the test flag in the `WHERE`. A one-to-many `JOIN` whose result is later counted or averaged. A dataset of tickets, reviews or messages that enters training without a deduplication pass. A metric query with no client filter in a multi-tenant system.

**Why it bites.** Evals run against production infrastructure and write real rows: a metric that includes them reports activity no client generated, and if eval volume grows the metric grows with it and reads as product growth. Near-duplicates make the same content fall into train and test, so the test metric measures memorization. A join that duplicates rows inflates the denominator and everything computed on top comes out wrong without any validation complaining.

**Backing.** `source + consensus`, with a blocking local rule.
- **Local rule (blocking).** In this repository the exclusion of test rows is written in `CLAUDE.md` in the exact form `is_test IS NOT TRUE` (which also drops `NULL`), has a guard test that fails CI, and reference commits `20b768abdf` and `23eed6d5a7`. It applies to `appointment.is_test`, `ticket_v2.is_test` and contacts with `platform = 'playground'` / `platformInformation.type = 'EVAL_TRIAL'`. Raw SQL is the worst case: it also skips the ORM's automatic soft delete.
- `source` — Lee et al., *Deduplicating Training Data Makes Language Models Better*, arXiv:2107.06499 — https://arxiv.org/abs/2107.06499 (they report train-test overlap "affecting over 4 % of the validation set" of standard benchmarks). How to deduplicate is in `NLP/text.md` TX7; how to split respecting the group is in `ML/evaluation.md`.

---

## C7. What you used to tune cannot be what you report

**What it requires.** The cases used to tune the prompt, the threshold or the model stay in a development set. The number that gets reported comes from a set that was not looked at during iteration.

**When it applies.** The diff adds cases to the eval file in the same commit that tunes the prompt, and the added cases are exactly the ones the change fixes. A `train_test_split` over a dataset where the same entity (user, client, annotator, document) appears in many rows. A set of search test queries written by whoever built the index.

**Why it bites.** The score goes to 100 % and means nothing: the system learned those cases by construction. The first different variant fails and the eval, which now has institutional authority, stays green. It is the most expensive way to lose the ability to detect regressions, because you do not lose the eval: you lose trust in it without anyone noticing. The retrieval version is the same trap: the author's queries are written with the index's vocabulary, so they retrieve well by construction, and the user who writes "cuanto sale el de 500" fails 100 % of the time without moving the metric a point.

**Backing.** `source + consensus`.
- `source` — Lee et al., arXiv:2107.06499 (duplicate contamination) — https://arxiv.org/abs/2107.06499; scikit-learn, *Group K-fold*: `GroupKFold` "ensures that the same group is not represented in both testing and training sets" — https://scikit-learn.org/stable/modules/cross_validation.html.
- `consensus` — it is the usual train/test separation applied to evals. What is debated is the size of each partition, not the separation.

---

## C8. A small n is not signal; every percentage carries a denominator and a spread

**What it requires.** Every ratio comes with absolute numerator and denominator, with the definition of which rows enter the denominator, and with some measure of uncertainty. With few observations per class, a difference of a few points is noise and the PR has to say so instead of presenting it as an improvement.

**When it applies.** The PR reports "it went from 80 % to 90 %" and the case file has 20 entries. A query or endpoint that returns only a ratio. An eval that runs once per variant. A deployment decision based on 0.3 points of F1 over a 500-row test set.

**Why it bites.** With n=20, two cases flipping move the number 10 points: noise gets merged, the next change "reverts the improvement" — also from noise — and an afternoon is lost investigating a regression that never existed. Or a change that actually worked is discarded because in those 20 cases it came out badly by chance. And "the error rate dropped 30 %" may be 10 out of 33 becoming 7 out of 33, or the result of the denominator growing because a filter was added: without the absolute numbers the two look identical on the chart.

**Backing.** `source + consensus`.
- `source` — Card et al., *With Little Power Comes Great Responsibility*, arXiv:2010.06595 — https://arxiv.org/abs/2010.06595 ("underpowered experiments are common in the NLP literature"). Miller, *Adding Error Bars to Evals*, arXiv:2411.00640 — https://arxiv.org/abs/2411.00640 (treat eval questions as a sample and plan the experiment). **Honesty note:** for the second one, the abstract and metadata were read, not the body; the concrete formulas are not cited here.
- The per-domain instrument lives in the specialties: paired comparison and wins/losses/ties in `LLM/evaluation.md` E12, repeated random splits in `ML/evaluation.md`, and statistical power in `NLP/text.md` TX11.

---

## C9. The average hides the tail: percentiles, worst case and disaggregation

**What it requires.** Every quality metric is reported with its distribution, not with the mean: p50, p90 and the count of cases below the acceptable minimum. And disaggregated across the dimensions where the product is heterogeneous: language, channel, client, class.

**When it applies.** An `AVG(...)` in SQL, a `reduce((a,b)=>a+b)/n`, or a dashboard that shows a single number per period. A single "intent classifier F1" cell in a product that operates in two languages. A multilingual or multi-client average presented as the health of the system.

**Why it bites.** An average score of 4.2 out of 5 can be "almost everything at 4-5" or "mostly 5 and 8 % at 1": those are different products, and the second one has customers who churn. When that 8 % grows to 12 %, the mean drops 0.1 and nobody reacts. With languages the same thing happens by another route: if 85 % of traffic is Spanish, the average is the Spanish number and the Portuguese regression is invisible until a client reports it.

**Backing.** `source + consensus`.
- `source` — Hu et al., *XTREME*, arXiv:2003.11080 — https://arxiv.org/abs/2003.11080, whose design (multi-task evaluation disaggregated by language) is the evidence for the practice. scikit-learn documents that multiclass micro-averaging with all labels included is identical to accuracy and therefore says nothing about the small classes — https://scikit-learn.org/stable/modules/model_evaluation.html. The per-language instrument is in `NLP/text.md` TX9.

---

## C10. Comparing two periods or two populations requires that they be comparable

**What it requires.** Any temporal or cross-segment comparison declares that volume, client mix, channel mix and time window are equivalent; or normalizes by that dimension.

**When it applies.** A "this month vs last month" or "before vs after the deploy" query; a `BETWEEN` with ranges of different length; ranges that cross a large onboarding, a holiday or a clock change. Also: comparing a model's number against a paper's without verifying that the metric is computed with the same formula.

**Why it bites.** Tuesday's quality drop is a new client with a different vertical that came in on Monday, and a week is spent investigating a code change that never happened. The quietest variant: the "after" range is shorter and has not yet accumulated the hard cases, which arrive with a lag, so every regression looks like an improvement for the first few days.

**Backing.** `consensus`.

---

## C11. Plausible but invented output does not reach the user unverified

**What it requires.** Every piece of data produced by a model that the user will treat as fact — identifiers, amounts, URLs, dates, product references, quotes — is verified against the source that generated it before being shown. If there is no source to verify against, the data should not be in the response. Verification is about membership, not just about shape: the id exists **and** belongs to this client.

**When it applies.** A field from the model output interpolated straight into a message, an email or a persisted record. A reference mechanism (markers, indices, short identifiers) where the code does not verify that the emitted reference exists. A tool argument used in a `where` or in an external URL without a prior query validating it against the client's scope. Concrete flag: a PR that documents as "graceful degradation" that a nonexistent reference is left literal in the message.

**Why it bites.** It is the failure mode that reaches the customer with the most convincing face: right format, right tone, false data. An invented identifier sends the user somewhere that does not exist; an invented amount becomes a commercial commitment. With a nonexistent id, the query returns empty and the handler answers "I found nothing", which is recoverable; with an existing id **from another client**, the query returns data and the assistant reads it: that case produces no error, no alert, and is a cross-tenant leak with nothing along the way to flag it.

**Backing.** `source + evidence`.
- `evidence` — "**`url-N` inventado por el modelo se entrega al usuario como texto plano.** El PR documenta como 'graceful degradation' que si el modelo alucina `url-7` y solo existen `url-1..url-3`, el placeholder queda literal" — PR #9813 (BE), `src/ai-message/utils/url-placeholder.ts` (Panda).
- `source` — OWASP Gen AI Security Project, *LLM05:2025 Improper Output Handling* and *LLM09 Misinformation*, within the Top 10 2025 — https://genai.owasp.org/llm-top-10/. OpenAI documents that structured output "doesn't prevent all kinds of model mistakes. For example, the model may still make mistakes within the values of the JSON object" — https://openai.com/index/introducing-structured-outputs-in-the-api/.
- **Honesty note.** The corpus documents the hallucinated identifier that reaches the user; the variant with a real id from another client is the same failure with a worse outcome, but it is not documented locally: that part is `consensus`.

---

## C12. A fallback that returns empty, zero or "safe" is indistinguishable from a valid result

**What it requires.** When the result cannot be used, the error path has to be distinguishable in the return type: an explicit state, not the empty list, not zero, not the permissive boolean. The caller has to be forced by the type to decide what to do with the failure.

**When it applies.** A `catch` that returns `[]`, `{}`, `null`, `0` or `true`; an `if (valid.length === 0) return <previous value>`; a default value for invalid output that coincides with a legitimate domain value; a cost or score computation whose default case is `0`.

**Why it bites.** Emptiness propagates without resistance. A guardrail that returns "safe" on error lets through everything it was supposed to block; an extractor that returns an empty list makes the consumer conclude there is no data and write that conclusion to the database; a score that falls to zero moves an average and nobody distinguishes it from a real zero. In every case the application error rate is zero, the dashboards are green, and detection arrives as a customer complaint weeks later, when it is no longer possible to reconstruct which calls failed. The hardest variant to see is the fallback that produces a *complete* and silently worse result: it does not come out empty, it comes out wrong.

**Backing.** `evidence + consensus`.
- `evidence` — "**el fallback de composición se queda con los criterios de menor peso** […] así que **cualquier** `added_criteri[a]`" — PR #13095 (BE), `src/ai-rubric/services/ai-rubric-plan.helpers.ts` (Panda). And its sibling: "**Bug — se descartan ejemplos válidos y el criterio queda con `examples_good: []`.**" — PR #13095 (BE), `ai-rubric-generation.service.ts` (Panda).

---

## C13. Every silent degradation carries a labeled counter

**What it requires.** Every degradation path — fallback taken, output discarded, truncation applied, retries exhausted, guardrail that blocked, prefilter that short-circuited, document left unclustered, language that could not be detected — increments an observable counter with labels (client, route, reason). A `logger.warn` is not a metric. And the logic that validates or merges results preserves the valid elements instead of discarding the whole block.

**When it applies.** A `catch` or a default-value `return` whose only observable effect is a log line. An `if (valid.length === 0) return []`. A `slice(0, MAX)` over a list with weights or scores applied in declaration order instead of relevance order. A clustering or detection pipeline that discards rows without counting them.

**Why it bites.** Without a counter there is no way to answer "does this happen once a day or 30 % of the time?", which is the only question that decides whether it gets fixed. There is no baseline either: when a model version change doubles the fallback rate, there is no "before" to compare against. Truncation by declaration order is especially treacherous because it cuts exactly the elements appended last, which tend to be the case-specific ones, and keeps the generic ones: nobody notices because the output always has the expected length. Silent degradation is by far the most common state of a model-based system that "works fine".

**Backing.** `evidence + consensus`.
- `evidence` — PR #13095 (BE), `ai-rubric-generation.service.ts`; PR #13096 (BE), `ai-rubric-profile.schema.ts`; PR #13101 (BE), `custom-judge-evaluation.service.ts` (Panda), where the point raised is precisely that the discards are silent.

---

## C14. No trace and no seed means no diagnosis

**What it requires.** Enough of every execution is persisted to reconstruct it: the exact input as it was sent (after all transformations, not before), the output as it arrived, the model identifier and version, the parameters, and an identifier that correlates with the conversation or the business job. Where the pipeline has stochastic components, the seed is fixed and stored.

**When it applies.** A new call or job that does not go through the tracing wrapper. An encoding, sanitizing or replacement step that happens outside the boundary where the trace is recorded. A pipeline with dimensionality reduction or sampling without `random_state`. A results table where the only thing persisted is a number or a boolean.

**Why it bites.** When a customer complains about a specific output, the only question that matters is what the model saw, and without the trace it is unanswerable: inputs are assembled at runtime from state that has already changed. The most treacherous variant is the trace that exists but records an intermediate form: if marker decoding happens after the logging boundary, the logs and the guardrails see `url-1` where the user saw a real URL, and the investigation starts from data that does not correspond to what happened. On the stochastic side, without a seed two runs of the same code give different results and any A/B comparison is contaminated by noise from the tooling itself.

**Backing.** `source + evidence`.
- `evidence` — "**Decode fuera del `retryFunction` deja `url-N` en guardrails y run logs.**" — PR #9813 (BE), `src/ai/ai-run-module/core/services/ai-run-llm.service.ts` (Panda). Infrastructure reinforcement: traces per `llm_call` are already stored in S3 with input, output and reasoning (the repository's `ai-traces` skill). If the trace can already be stored, not storing it is a decision, not a limitation.
- `source` — BERTopic, *FAQ: Why are the results not consistent between runs?*: "due to the stochastic nature of UMAP, the results […] might differ even if you run the same code multiple times" — https://maartengr.github.io/BERTopic/faq.html.

---

## C15. One derived artifact, one model, one version

**What it requires.** All vectors in an index come from the same model and the same version; all scores in a series come from the same versioned rubric. The model or version identifier is persisted alongside the derived data, and changing it forces reprocessing everything, not writing the new next to the old.

**When it applies.** A migration that changes the embedding model name, the dimension or the provider without a backfill of the vector table. A write path into the index that uses a different model from the initial load pipeline. A change to the text of a rubric criterion while old scores stay in the same table with no version discriminator.

**Why it bites.** Two independently trained models do not share a vector space even if they have the same dimensionality: distances between them mean nothing. Search does not fail — it returns results — they are just arbitrary for queries whose neighborhood crosses the two populations. Without the stored identifier, it cannot even be diagnosed afterwards: there is no way to know which vectors need recomputing. With rubrics the same thing happens along the time axis: the "quality jump" of March 12 is the date somebody reworded a criterion.

**Backing.** `source + consensus`.
- `source` — Reimers and Gurevych, *Making Monolingual Sentence Embeddings Multilingual using Knowledge Distillation*, arXiv:2004.09813 — https://arxiv.org/abs/2004.09813: the premise of the method is that **distillation** is needed for two models to land in the same space; if they were already compatible, the method would be unnecessary. The concrete instrument is in `NLP/representations.md` RP7.

---

## C16. Bound every unbounded-length text before it enters a prompt, an index or a feature

**What it requires.** Every text whose size is determined by a third party — tool output, transcript, history, document, HTTP response body, query result — is truncated with an explicit maximum before use. The maximum is a named constant; the truncation criterion (the first N, a summary, the relevant fields) is chosen on purpose; which end is kept is a decision; and the truncation leaves a visible mark in the resulting text.

**When it applies.** An interpolation in a template or a `push` into a message array whose value comes from an `await` on a tool call, from a `text`/`jsonb` column, from a `join` over a list, or from an external API, with no `slice`, `substring` or token limit along the way. A `JSON.stringify` of an API response whose size depends on client data. A full transcript indexed into a single `tsvector` column.

**Why it bites.** In development the value is 200 characters and in production it is 400 KB: the size is not controlled by whoever writes the code, it is controlled by the client's catalog. Three consequences, none of them obvious. Cost: a call that costs a hundred times the median, aggregated into the end-of-month bill with no attribution to that route. Availability: if it exceeds the limit, it fails entirely for that client and only for that client, so the bug is reported as "it doesn't work for the big account". Quality: if it fits but occupies most of the context, nothing fails — the model simply starts ignoring its instructions, buried under the data dump. And if the head of a chronological history is kept, the current turn is lost and the system answers a question that is no longer the one that was asked.

**Backing.** `source + evidence`.
- `evidence` — "tendría ojo con las toolcalls y el output que puedan a llegar que puede ser enorme, pasarselo a la AI nos puede salir muy caro en ocasiones. Slice con un maximo de caracteres." — PR #9629 (BE), `src/assistant-v2/ai-tool-call/services/ai-tool-call.service.ts` (Max). It is the cost criterion this team asked for most clearly.
- `source` — Anthropic, *Writing effective tools for agents*: "For Claude Code, we restrict tool responses to 25,000 tokens by default" — https://www.anthropic.com/engineering/writing-tools-for-agents. On the index side, PostgreSQL documents hard `tsvector` limits (1 MB total length, 16,383 positions) that fail at runtime — https://www.postgresql.org/docs/current/textsearch-limitations.html. The character-level counterpart (truncating on grapheme clusters) is in `NLP/text.md` TX3, and the index-side one in `NLP/search.md` SR5.

---

## C17. A shared constant, text or threshold has total blast radius

**What it requires.** A guardrail text, an instruction constant, a global threshold or a default model identifier that applies to all consumers is evaluated against **all** of them: previous versions, background jobs, crons and queue consumers. If the restriction is specific to one case, it goes parameterized; if it is global, it is written in global terms and does not mention the concept, format or capability of a single version or client.

**When it applies.** A constants file modified; a shared string that mentions a feature name, an internal format or a capability that only exists in one version; a change in a service that is also invoked from a queue consumer or a cron.

**Why it bites.** These constants have no visible owner and their consumers do not appear in the diff. The change ships to everyone: those who do not have that concept receive an instruction about something that does not exist in their world. The bug shows up in the version nobody touched, so the hunt for the culprit starts in the wrong place. The worse variant is the nightly job: the fix on the interactive path is fine, but the sync route calls the same code and at dawn it leaves production state in an inconsistent shape; the team arrives in the morning to a broken client and a deploy from the day before that "only touched something else".

**Backing.** `evidence`.
- "ojo con mencionar escenario porque tambien está para los v2" — PR #10224 (BE), `src/ai/no-reply/no-reply.constants.ts` (Max); "esto igual creo que puede ser demasiado restrictivo" — PR #9100 (BE), `thinking-tag-leak.guard.ts` (Max); "**El sync nocturno de Reservo va a dejar schema y skill_context contradictorios en Waxkin prod.** Este fix quedó bien acá, pero `update-reservo-function.service.ts` (la queue del treatment sync nocturno) llama al mismo" service — PR #12808 (BE) (Panda).

---

## C18. Every model metric comes with a business metric

**What it requires.** A judge score, a classifier's accuracy or a search recall are not the goal: they are the proxy. The PR names which business number is expected to move — resolution without a human, escalations, repurchase, time to useful answer, reopened tickets — even if it does not measure it yet.

**When it applies.** A dashboard, a metric or a gate based exclusively on a model score.

**Why it bites.** Proxies get optimized until they stop correlating. The score goes up three quarters in a row, the business does not move, and when somebody asks, nobody remembers why that proxy was chosen. The expensive part is not the wasted work: it is the credibility, because the next metric the team proposes will not be believed either.

**Backing.** `consensus`.

---

## Note on the local terrain

The review corpus of this team has a very marked shape, and that shape is information. What does get reviewed in great detail: prompts, guards, regexes and detection patterns, structured output schemas, placeholders, error messages that go back to the model, blast radius of shared constants. What almost never gets reviewed: evals, quality metrics, embeddings and vector search.

Three consequences for a reviewer:

1. A finding about prompts or guards lands on known ground: there is formed judgment and local precedent to cite.
2. A finding about evals, metrics or retrieval lands on virgin ground. You have to explain the mechanism, not just name it, and lean on `source` because there is no local `evidence`. It is also where the marginal value is highest: the defect nobody looks at is the one that goes longest without being fixed.
3. The absence of comments is not evidence of the absence of defects, it is exactly the reverse. A contaminated eval or an uncalibrated judge produce green numbers for months precisely because objecting to them requires looking at something nobody looks at today.
