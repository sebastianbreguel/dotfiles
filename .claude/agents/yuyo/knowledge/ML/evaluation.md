---
updated: 2026-08-16
ttl: 24 months
sources: 13
---

# Yuyo — ML: Evaluation and Splits

**What this covers.** Which metric answers which question, what class imbalance does to those metrics, and how to partition data so the reported number means something. Out of scope: whether the score is a probability (`calibration.md`), how the model was tuned (`construction.md`), and evaluating clusterings without labels (`clustering.md`).

**Origin note.** The first seven principles here were written for the NLP knowledge file and are migrated unchanged in substance, translated, with their URLs and backing levels preserved. They were misfiled: `GroupKFold`, SMOTE, macro/micro F1 and PR-AUC operate on any feature matrix, not on text. The remaining principles are new research.

**Backing scale.** Identical to the core file. A principle may carry two levels.

- **`source`** — official documentation, paper, or standard cited with a URL.
- **`evidence`** — a senior reviewer asked for it in a real PR of this repository, with a verbatim quote.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both are named and one is recommended with its tradeoff.

---

## 1. Metric choice

### Report macro-F1 and micro-F1 together, knowing what each one measures

**What it requires.** The report states which averaging it uses and, for multiclass, includes both macro and micro. Additional check: verify which of the two macro-F1 formulas the library uses before comparing the number against a paper's.

**When it applies.** A single F1 figure with no averaging specified. A dashboard showing accuracy on a problem with imbalanced classes.

**Why it bites.** In multiclass with all labels included, the micro-average is identical to accuracy: reporting it alone adds no information about the small classes, which are usually the ones that matter. And the two macro-F1 formulas in circulation can diverge by up to 0.5 and produce contradictory classifier rankings, with one of them systematically favouring models with an unbalanced error distribution.

**Backing.** `source` — scikit-learn, *Multiclass and multilabel classification* — https://scikit-learn.org/stable/modules/model_evaluation.html: "if all labels are included, micro-averaging in a multiclass setting will produce precision, recall and F that are all identical to accuracy", and it warns that the "weighted" average can produce an F-score that is not between precision and recall. On the two formulas: Opitz and Burst, *Macro F1 and Macro F1*, arXiv:1911.03347 — https://arxiv.org/abs/1911.03347.

---

### With imbalanced classes, look at the precision-recall curve, not the ROC

**What it requires.** For rare-event detection, evaluation is done on the precision-recall curve and average precision, not on ROC-AUC.

**When it applies.** Positive-class prevalence below roughly 10% together with a reported ROC-AUC above 0.9. Any fraud, spam, rare-intent, or alerting detector.

**Why it bites.** When the positive class is rare, ROC gives an excessively optimistic impression because the false positive rate is diluted against an enormous denominator of negatives. The team reads 0.95 AUC and deploys a detector whose real precision makes most alerts false, which trains the user to ignore them.

**Backing.** `source` — Saito and Rehmsmeier, *The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets*, PLOS ONE 2015, DOI 10.1371/journal.pone.0118432 — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432. Implementation: `average_precision_score` / `precision_recall_curve` — https://scikit-learn.org/stable/modules/model_evaluation.html. **Read the next principle before treating this as unconditional.**

---

### Do not treat AUPRC as automatically superior to AUROC under imbalance

**What it requires.** "The classes are imbalanced, therefore AUPRC" is no longer sufficient on its own. Justify the metric by the decision it feeds: AUPRC weights improvements where the positives are dense, AUROC weights all thresholds equally.

**When it applies.** A PR that switches the headline metric to average precision citing imbalance alone, especially on a model that serves multiple subpopulations with different positive rates (per-country, per-segment, per-channel).

**Why it bites.** AUPRC is not threshold-neutral: it rewards gains concentrated in the region where positives are most frequent. If your population is a mix of subgroups with different prevalence, optimizing AUPRC systematically favours improvements in the high-prevalence subgroup and can be indifferent to — or reward — degradation in the rare one. Under a fairness or coverage requirement that is the opposite of what you wanted, and the aggregate metric goes up while the subgroup you were protecting gets worse.

**Backing.** `source + debated` — McDermott, Zhang, Hansen, Angelotti and Gallifant, *A Closer Look at AUROC and AUPRC under Class Imbalance*, arXiv:2401.06091 (submitted 11 January 2024) — https://arxiv.org/abs/2401.06091: "a widespread claim is that the area under the precision-recall curve (AUPRC) is a superior metric for model comparison to the area under the receiver operating characteristic (AUROC) for tasks with class imbalance. This paper refutes this notion on two fronts. First, we theoretically characterize the behavior of AUROC and AUPRC in the presence of model mistakes, establishing clearly that AUPRC is not generally superior in cases of class imbalance. We further show that AUPRC can be a harmful metric as it can unduly favor model improvements in subpopulations with more frequent positive labels."
- *Position A (Saito and Rehmsmeier, 2015):* under imbalance the PR plot is more informative than ROC, because ROC hides the false-positive cost.
- *Position B (McDermott et al., 2024):* AUPRC's advantage is not general, and its subpopulation behaviour can be actively harmful.
- **Recommendation:** report the PR curve *and* precision at the operating point you will actually deploy, rather than substituting one summary scalar for another. Both papers agree on the underlying point — the aggregate curve is not the decision. **Tradeoff:** two numbers and one plot in the PR against a single headline that can move for reasons you did not intend. Practice that **changed**: "imbalanced, therefore AUPRC" was the reflex from 2015 to about 2024.

---

### Consider MCC for binary classification

**What it requires.** When the negative class also carries cost, the report includes the Matthews correlation coefficient in addition to F1.

**When it applies.** A report with only the positive-class F1 on a problem where labelling something "no action required" has real cost.

**Why it bites.** MCC only gives a high score if the model is right in all four cells of the confusion matrix, proportionally to the sizes of positives and negatives. F1 and accuracy can produce high scores while ignoring one of those cells — which is exactly the one that hurts in the business case.

**Backing.** `source + debated` — Chicco and Jurman, *The advantages of the Matthews correlation coefficient (MCC) over F1 score and accuracy in binary classification evaluation*, BMC Genomics 21, 6 (2020) — https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-019-6413-7.
- *Position A (Chicco and Jurman):* MCC should be the default binary metric because it is symmetric and is not fooled by imbalance.
- *Position B (dominant practice):* positive-class F1 remains standard because tasks usually have one clear side of interest and it communicates more easily to the business.
- **Recommendation:** report both when both classes carry cost; F1 alone only when the business genuinely looks at one side. **Tradeoff:** one more column in the table against one less discussion about whether the number is misleading.

---

### Pick the metric from the decision the model feeds, then tune the threshold to that metric

**What it requires.** The evaluation names the downstream decision and the cost of each error type, then chooses the operating threshold to optimize that, rather than inheriting 0.5. In scikit-learn this is `TunedThresholdClassifierCV` with a scorer that encodes the cost; hand-rolled is fine as long as the threshold is fitted on held-out data.

**When it applies.** Observable: `model.predict(X)` (which hardcodes 0.5 for a binary classifier) feeding an action, or a threshold constant with no derivation next to it. Also: an evaluation section that reports only threshold-free metrics (AUC, average precision) for a model that will be deployed at exactly one threshold.

**Why it bites.** 0.5 is the point where the two classes are equally probable, which is only the right operating point when the two error types cost the same amount — almost never true. A threshold-free metric can look excellent while the deployed operating point is far from optimal, so the model appears to be underdelivering and the response is to change models rather than to move one number. The correct threshold is frequently nowhere near 0.5.

**Backing.** `source` — scikit-learn, *Tuning the decision threshold for class prediction* — https://scikit-learn.org/stable/modules/classification_threshold.html: "`TunedThresholdClassifierCV` tunes this threshold using an internal cross-validation. The optimum threshold is chosen to maximize a given metric." Their worked example: "the vanilla classifier predicts the class of interest for a conditional probability greater than 0.5 while the tuned classifier predicts the class of interest for a very low probability (around 0.02). This decision threshold optimizes a utility metric defined by the business (in this case an insurance company)." The docs also warn that "these metrics come with default parameters, notably the label of the class of interest (i.e. `pos_label`)" — a default `pos_label` pointed at the wrong class silently optimizes the wrong thing. Note the interaction with `calibration.md`: a tuned threshold on an uncalibrated score is valid but is not portable across retrains.

---

## 2. Class imbalance

### Before applying SMOTE, check whether your classifier needs it

**What it requires.** Synthetic balancing enters the pipeline only with an experiment demonstrating the gain. Cheaper alternatives to try first: `class_weight='balanced'` and moving the decision threshold.

**When it applies.** `imblearn` in `requirements.txt` with no accompanying experiment.

**Why it bites.** With a well-tuned modern classifier and appropriate metrics, balancing does not improve prediction and adds one more component to the pipeline: more code, more variance, more surface for train and serving to diverge.

**Backing.** `source + debated` — Elor and Averbuch-Elor, *To SMOTE, or not to SMOTE?*, arXiv:2201.08528 — https://arxiv.org/abs/2201.08528: "balancing does not improve prediction performance for the strong [classifiers]".
- *Position A (Elor and Averbuch-Elor):* with a well-tuned modern classifier, balancing contributes nothing.
- *Position B:* it remains useful with simple models, with very small minority samples, or when the pipeline does not allow tuning the threshold or class weights.
- **Recommendation:** class weights and threshold first; SMOTE only if the experiment justifies it. **Tradeoff:** one extra comparison run against a permanent component in the pipeline.
- Practice that **changed**: this was the reflex recipe for imbalance.
- Second-order consequence, owned by `calibration.md`: resampling shifts the base rate the model was fitted to, so its output probabilities are no longer comparable to the deployment population.

---

## 3. Splits

### Deduplicate near-identical rows before partitioning the dataset

**What it requires.** Before the split, a deduplication pass: hash the normalized record and count collisions, then a similarity pass (MinHash, trigrams, or nearest-neighbour distance on the feature vector) for near-duplicates.

**When it applies.** Any corpus where the same underlying event can produce several nearly identical rows — templated tickets, forwarded messages, re-imported product descriptions, retried webhook payloads, re-uploaded documents — entering `train_test_split` with no deduplication.

**Why it bites.** If you do not deduplicate before the split, the same content lands in train and in test and the test metric measures memorization. The number stays permanently high and the drop only appears in production, where there is nothing to compare it against.

**Backing.** `source` — Lee et al., *Deduplicating Training Data Makes Language Models Better*, arXiv:2107.06499 — https://arxiv.org/abs/2107.06499: they document removing from C4 a single 61-word sentence repeated over 60,000 times, and report that deduplication reduces train-test overlap "that affects over 4% of the validation set" of standard benchmarks.

**Cross-reference — this boundary matters.** *How* to detect near-duplicate **text** (normalization, shingling, MinHash, embedding thresholds) belongs to `NLP/text.md`; that file owns the detection technique for the text modality. What this file owns is the **consequence, for any modality**: near-identical rows must not land on opposite sides of a split. The same requirement holds for duplicated numeric rows, repeated sensor windows, and re-emitted events, where the detector is not a text technique at all. If you are reviewing a text pipeline, read both — the detector there, the split rule here.

---

### Split by group (document, user, annotator, account), not by row

**What it requires.** If several rows come from the same entity, the partition respects the group.

**When it applies.** A `train_test_split(X, y, random_state=42)` over a dataset where rows are messages and there are few users, customers, or annotators each generating many rows. Observable signal: the test metric is much better than production.

**Why it bites.** A random per-row split leaves the same entity in train and in test, and if that entity has idiosyncratic characteristics the model learns them and the metric overestimates generalization. With annotators the effect has been measured: models recognize the most productive annotators and often fail to generalize to examples from annotators who did not contribute to the training set.

**Backing.** `source` — scikit-learn, *Group K-fold* — https://scikit-learn.org/stable/modules/cross_validation.html: `GroupKFold` "ensures that the same group is not represented in both testing and training sets […] if the model is flexible enough to learn from highly person specific features it could fail to generalize to new subjects". Domain-specific evidence: Geva, Goldberg and Berant, *Are We Modeling the Task or the Annotator?*, arXiv:1908.07898 — https://arxiv.org/abs/1908.07898.

---

### When the rows are ordered in time, the split must be too

**What it requires.** For data with a temporal order — anything where a feature could be computed after the label was determined, or where the population drifts — training folds precede test folds. `TimeSeriesSplit` (with a `gap` when features have a lookback window), or an explicit date cut, and the cut date is stated in the PR.

**When it applies.** Highly observable: a `random_state` shuffle over a table that has a `created_at`, especially when features are aggregates ("orders in the last 30 days", "average ticket resolution time") whose window can straddle the label's timestamp.

**Why it bites.** A shuffled split lets the model train on next month and test on last month. Two things break at once. First, straightforward leakage: an aggregate feature computed over a window that includes post-label rows encodes the answer. Second, and subtler, the shuffled estimate answers a question you never asked — "how well does this model interpolate within a period it has seen?" — while production asks "how well does it extrapolate to a period it has not?" Those two numbers can differ by a lot, in the direction that flatters the offline report. This is one of the leakage types the field-wide survey found repeatedly.

**Backing.** `source` — scikit-learn, *Cross validation of time series data* — https://scikit-learn.org/stable/modules/cross_validation.html: "`TimeSeriesSplit` is a variation of *k-fold* which returns first \(k\) folds as train set and the \((k+1)\) th fold as test set. Note that unlike standard cross-validation methods, successive training sets are supersets of those that come before them... This class can be used to cross-validate time series data samples that are observed at fixed time intervals. Indeed, the folds must represent the same duration, in order to have comparable metrics across folds." The `gap` parameter exists precisely to drop the rows between train and test whose feature windows would overlap. Field-level evidence that temporal leakage is common rather than exotic: Kapoor and Narayanan, *Leakage and the Reproducibility Crisis in ML-based Science*, arXiv:2207.07048 — https://arxiv.org/abs/2207.07048, which reports "17 fields where errors have been found, collectively affecting 329 papers" and presents "a fine-grained taxonomy of 8 types of leakage".

---

### A fixed split is not statistical evidence

**What it requires.** Differences between systems are supported with repeated random splits and statistical tests, not with a single held-out test set.

**When it applies.** Someone proposes deploying model B because it has 0.3 F1 points more than A on a 500-row test set.

**Why it bites.** Ranking systems by their performance on a single split produces conclusions that do not replicate: that delta probably will not survive a change of seed. You deploy the model that won by chance and the next contradictory measurement gets attributed to something else.

**Backing.** `source` — Gorman and Bedrick, *We Need to Talk about Standard Splits*, ACL 2019, pp. 2786–2791, DOI 10.18653/v1/P19-1267 — https://aclanthology.org/P19-1267/: "it is standard practice […] to rank systems according to their performance on a held-out test set reserved for evaluation. However, few researchers apply statistical tests to determine whether differences in performance are likely to arise by chance." The recommendation is settled; the adoption is not. Mechanics for the repeated-split part: `RepeatedKFold` / `RepeatedStratifiedKFold` — https://scikit-learn.org/stable/modules/cross_validation.html.

---

### The test set is a budget; every look spends some of it

**What it requires.** The number of times the test set has influenced a decision is tracked, and when the count gets high the set is retired and replaced. Model selection, feature selection, threshold selection, and "let me just check" all count as looks.

**When it applies.** A test set that has been in the repository across many PRs, referenced by every experiment. Observable: an evaluation script pointed at a fixed `test.csv` that also appears in the tuning notebook.

**Why it bites.** Each decision made by comparing test scores fits one bit of the test set's noise into your process. It never fails visibly — the reported number stays high, because it is being optimized. What degrades is the relationship between that number and production, and there is no signal that tells you it has degraded, because the only instrument you had was the thing you were overfitting. The effect is the same mechanism as tuning on the validation set (see `construction.md`), just slower and harder to see.

**Backing.** `source` — Cawley and Talbot, *On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation*, JMLR 11 (2010) — https://www.jmlr.org/papers/v11/cawley10a.html: "we show that some common performance evaluation practices are susceptible to a form of selection bias as a result of this form of over-fitting and hence are unreliable", and note the degradation "is often of comparable magnitude to differences in performance between learning algorithms". The specific operational rule — count the looks, retire the set — is `consensus` built on top of that finding rather than a claim the paper makes.

---

## What changed

1. **"Imbalanced, therefore AUPRC" lost its unconditional status.** The 2015 result that made PR-AUC the default under imbalance is now paired with a 2024 theoretical analysis showing AUPRC is not generally superior and can be actively harmful across subpopulations with different prevalence (McDermott et al. — https://arxiv.org/abs/2401.06091). Report the operating point, not just the curve.
2. **SMOTE is no longer the reflex answer to imbalance** — with strong, well-tuned classifiers, balancing does not improve prediction (Elor and Averbuch-Elor, 2022 — https://arxiv.org/abs/2201.08528). Class weights and threshold tuning come first.
3. **Threshold selection became a first-class, library-supported step.** scikit-learn now ships `TunedThresholdClassifierCV` (https://scikit-learn.org/stable/modules/classification_threshold.html), which moves "pick the operating point from the business cost" from folklore into the API. A PR that still hardcodes `predict()` at 0.5 for a cost-asymmetric decision is behind current tooling, not just behind best practice.

---

## Sources I could not open or verify

1. **Robertson-style paywalled venues were avoided in this file**; every citation above resolved to a page or PDF that opened. The one indirect claim is the `RepeatedKFold` recommendation attached to Gorman and Bedrick: the paper argues for repeated splits and statistical testing, the specific scikit-learn iterator is our implementation choice, not theirs.
2. **The "count the looks at the test set" rule** has no primary source stating it in that form. It is presented as `consensus` layered on Cawley and Talbot's selection-bias result, and is labelled as such rather than attributed to them.

**Date the sources in this file were consulted:** 15–16 August 2026 (migrated principles, 15 August; new research, 16 August).
