---
updated: 2026-08-16
ttl: 24 months
sources: 7
---

# Yuyo — ML: Calibration

**What this covers.** The gap between the number a classifier returns and the probability someone reads it as. When that gap matters, how to close it, how to measure whether you closed it, and the two ways teams accidentally re-open it. Out of scope: choosing the model (`selection.md`), the metric used to rank models (`evaluation.md`).

**The one-sentence version.** `predict_proba` returns a number in [0, 1]. That is the only property it is guaranteed to have. It is not, by construction, the fraction of positives among rows that scored the same.

**Backing scale.** Identical to the core file. A principle may carry two levels.

- **`source`** — official documentation, paper, or standard cited with a URL.
- **`evidence`** — a senior reviewer asked for it in a real PR of this repository, with a verbatim quote.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both are named and one is recommended with its tradeoff.

---

### Treat `predict_proba` from a boosted tree or an SVM as a ranking score, not a probability

**What it requires.** Before a score from a max-margin or boosted model is used as a probability, it is either calibrated or explicitly documented as "monotone score only, do not read the value".

**When it applies.** Observable in code: `predict_proba(...)[:, 1]` from `GradientBoostingClassifier`, `XGBClassifier`, `AdaBoostClassifier`, `SVC(probability=True)`, or `RandomForestClassifier`, whose output is then compared to a literal (`> 0.7`), stored in a column named `probability`, multiplied by a monetary value, or shown to a user as a percentage.

**Why it bites.** The distortion is systematic and has a known shape, so it is not noise you can average away. Boosted models push probability mass away from 0 and 1 — a score of 0.8 corresponds to a true positive rate well above 0.8. Random forests do the same for a different reason (averaging over base models that cannot themselves reach 0 or 1). Naive Bayes distorts in the opposite direction, pushing scores toward the extremes. Someone reads "0.9 confidence" as ninety percent, sets a business rule on it, and the rule fires at a rate nobody predicted — usually too often, and the discovery is a load or cost problem, not a modelling one.

**Backing.** `source` — Niculescu-Mizil and Caruana, *Predicting Good Probabilities With Supervised Learning*, ICML 2005 — https://www.cs.cornell.edu/~alexn/papers/calibration.icml05.crc.rev3.pdf: "We show that maximum margin methods such as boosted trees and boosted stumps push probability mass away from 0 and 1 yielding a characteristic sigmoid shaped distortion in the predicted probabilities. Models such as Naive Bayes, which make unrealistic independence assumptions, push probabilities toward 0 and 1. Other models such as neural nets and bagged trees do not have these biases and predict well calibrated probabilities." scikit-learn, *Probability calibration* — https://scikit-learn.org/stable/modules/calibration.html — reproduces this for `RandomForestClassifier` ("the histograms show peaks at probabilities approximately 0.2 and 0.9, while probabilities close to 0 or 1 are very rare") and notes `LinearSVC` "shows an even more sigmoid curve than the random forest, which is typical for maximum-margin methods". Separately, scikit-learn's SVM page states outright that "SVMs do not directly provide probability estimates, these are calculated using an expensive five-fold cross-validation" — https://scikit-learn.org/stable/modules/svm.html.

---

### Calibrate whenever the score becomes a threshold someone decided on

**What it requires.** The trigger for calibration is not "the model is a tree". It is: does anything downstream compare the score to a fixed number, or arithmetic with it? If yes, calibrate. If the score is only ever sorted — a ranked queue, a top-k retrieval — calibration is optional and can be skipped with a note.

**When it applies.** Observable: a constant compared against a model score anywhere in the codebase (`if score > 0.85`), a score multiplied by an amount (expected value, expected loss), a score summed across rows to forecast a volume, or two models' scores compared to each other.

**Why it bites.** An uncalibrated score is still a valid ordering, so ranking use cases survive. A threshold does not: the same 0.85 means different things before and after a retrain, because the distortion depends on the fitted model. So the threshold that was tuned in March quietly becomes a different operating point in June with no config change, and the alert volume moves. Expected-value arithmetic is worse — multiplying a distorted probability by a real amount gives a number with monetary units and no meaning, which is exactly the kind of number that ends up in a business case.

**Backing.** `source` — scikit-learn, *Probability calibration* — https://scikit-learn.org/stable/modules/calibration.html: "well calibrated classifiers are probabilistic classifiers for which the output of `predict_proba` can be directly interpreted as a confidence level... the samples to which it gave a `predict_proba` value close to, say, 0.8, approximately 80% actually belong to the positive class." That the threshold is a business decision separate from the model is made explicit in scikit-learn, *Tuning the decision threshold for class prediction* — https://scikit-learn.org/stable/modules/classification_threshold.html: in their worked insurance example "the vanilla classifier predicts the class of interest for a conditional probability greater than 0.5 while the tuned classifier predicts the class of interest for a very low probability (around 0.02). This decision threshold optimizes a utility metric defined by the business."

---

### Fit the calibrator on data the model never saw

**What it requires.** The calibration map is fitted on held-out predictions — either via cross-validation inside `CalibratedClassifierCV`, or on an explicitly disjoint calibration split. Never on the same rows the classifier was fitted on.

**When it applies.** Observable: `CalibratedClassifierCV(estimator=FrozenEstimator(clf))` (or the older `cv='prefit'` form) where the `clf` was fitted on the same `X` being passed in. Or a hand-rolled sigmoid/isotonic fit on `clf.predict_proba(X_train)`.

**Why it bites.** On training rows the model is overconfident *and correct*, so the calibration curve looks nearly perfect and the fitted map is close to the identity. You then ship a calibrator that does nothing, and the reliability diagram — computed on the same rows — confirms it is fine. The error surfaces only on new data, where the original distortion is fully present and now carries a "calibrated" label that stops anyone from looking again.

**Backing.** `source` — scikit-learn, *Probability calibration*, Usage — https://scikit-learn.org/stable/modules/calibration.html: "`CalibratedClassifierCV` uses a cross-validation approach to ensure unbiased data is always used to fit the calibrator. The data is split into \(k\) `(train_set, test_set)` couples (as determined by `cv`)... a clone of `base_estimator` is trained on the train subset, the trained `base_estimator` makes predictions on the test subset, the predictions are used to fit a calibrator." For the prefit path the docs put the burden on you: "It is up to the user to make sure that the data used for fitting the classifier is disjoint from the data used for fitting the regressor."

---

### Choose Platt scaling or isotonic regression by how much calibration data you have

**What it requires.** The choice between `method='sigmoid'` (Platt scaling: fit a one-parameter logistic map on the scores) and `method='isotonic'` (fit any monotone step function) is made on the size of the calibration set, and the size is stated.

**When it applies.** Any `CalibratedClassifierCV(method=...)`. The number to look at is how many rows land in each calibration fold, not the total dataset size — with `cv=5` on 3,000 rows, each calibrator sees roughly 600.

**Why it bites.** Isotonic is strictly more expressive: it corrects any monotone distortion, not just the sigmoid one. That expressiveness is also its failure mode. On a small calibration set it fits the noise in the score distribution and produces a step function that is wrong in exactly the region you care about — the high-score tail, where there are fewest points and where your threshold lives. The result is a "calibrated" model that is worse than the uncalibrated one at the operating point, and the aggregate calibration metric does not show it because the tail is a small fraction of rows.

**Backing.** `source` — Niculescu-Mizil and Caruana, ICML 2005 — https://www.cs.cornell.edu/~alexn/papers/calibration.icml05.crc.rev3.pdf. On the mechanism: "Platt Scaling is most effective when the distortion in the predicted probabilities is sigmoid-shaped. Isotonic Regression is a more powerful calibration method that can correct any monotonic distortion. Unfortunately, this extra power comes at a price. A learning curve analysis shows that Isotonic Regression is more prone to overfitting, and thus performs worse than Platt Scaling, when data is scarce." On the size threshold, verbatim: "When the calibration set is small (less than about 200-1000 cases), Platt Scaling outperforms Isotonic Regression with all nine learning methods... When there are 1000 or more points in the calibration set, Isotonic Regression always yields performance as good as, or better than, Platt Scaling."
- Practical rule: **under ~1000 calibration points, sigmoid; at 1000+, isotonic.**
- Same paper, worth knowing before you add the step at all: "For learning methods that make well calibrated predictions such as neural nets, bagged trees, and logistic regression, neither Platt Scaling nor Isotonic Regression yields much improvement in performance even when the calibration set is very large. With these methods calibration is not beneficial, and actually hurts performance when the calibration sets are small."

---

### Read the reliability diagram; do not read a Brier score as a calibration metric

**What it requires.** The evidence that a model is calibrated is a reliability diagram (predicted probability on x, observed fraction of positives on y, plus the histogram of how many points fall in each bin). A single scalar may accompany it but does not replace it.

**When it applies.** A PR that reports "Brier score improved from 0.14 to 0.12" or "ECE is 0.03" as proof that calibration worked, with no plot and no bin counts.

**Why it bites.** Two independent problems. First, the Brier score and log loss are strictly proper scoring rules that mix calibration with discrimination and with the base rate — a *lower* Brier score can mean a *worse* calibrated model that happens to separate the classes better. Second, binned calibration error understates itself: the binning is what makes it computable and also what hides error inside bins, so the number you report is optimistic by an unknown amount. The diagram shows you what the scalar hides — specifically the sparse high-score bins where your threshold sits.

**Backing.** `source + debated` — scikit-learn, *Probability calibration* — https://scikit-learn.org/stable/modules/calibration.html defines the diagram ("Calibration curves, also referred to as *reliability diagrams* (Wilks 1995), compare how well the probabilistic predictions of a binary classifier are calibrated") and warns about the scalar: "Strictly proper scoring rules for probabilistic predictions like `sklearn.metrics.brier_score_loss` and `sklearn.metrics.log_loss` assess calibration (reliability) and discriminative power (resolution) of a model, as well as the randomness of the data (uncertainty) at the same time... As it is not clear which term dominates, the score is of limited use for assessing calibration alone... A lower Brier loss, for instance, does not necessarily mean a better calibrated model, it could also mean a worse calibrated model with much more discriminatory power." On binned estimators: Kumar, Liang and Ma, *Verified Uncertainty Calibration*, NeurIPS 2019, arXiv:1909.10155 — https://arxiv.org/abs/1909.10155: "popular recalibration methods like Platt scaling and temperature scaling are (i) less calibrated than reported, and (ii) current techniques cannot estimate how miscalibrated they are."
- *Position A (Kumar et al.):* the usual ECE number is not trustworthy; use estimators with measurable error (their scaling-binning calibrator) if you need a guarantee.
- *Position B (common practice):* ECE with a fixed bin count is fine as a relative signal when comparing two versions of the same model on the same data.
- **Recommendation:** the diagram is the deliverable; report a scalar only for run-to-run comparison, always with the bin counts next to it, and never as a standalone claim of calibration. **Tradeoff:** a plot in the PR against a number that reviewers cannot audit.

---

### If you resampled or reweighted the classes, the output probabilities are shifted and must be corrected

**What it requires.** Any pipeline that changes the class balance of the training set — undersampling the majority, SMOTE, `class_weight='balanced'` — produces scores calibrated to the *training* base rate, not the deployment one. Either correct them analytically, or fit the calibrator on an uncorrected sample that carries the real base rate.

**When it applies.** Highly observable and very common: `RandomUnderSampler` / `SMOTE` / `class_weight='balanced'` anywhere in the training pipeline, combined with a `predict_proba` whose value (not just its ordering) is consumed downstream.

**Why it bites.** Undersampling negatives from 99:1 to 1:1 makes the model behave as if positives were half the world. Its scores come out far too high for the population it will actually see — a genuinely 1% event scores near 0.5. Everything still *works*: ranking is fine, AUC is fine, and if you tuned the threshold on the resampled validation set the threshold is fine too. What is broken is any use of the number itself: expected-value calculations, volume forecasts, anything a human reads as a percentage. The two mistakes stack, because resampling and reading probabilities are both things teams do when the classes are imbalanced.

**Backing.** `source` — Elkan, *The Foundations of Cost-Sensitive Learning*, IJCAI 2001 — https://cseweb.ucsd.edu/~elkan/rescale.pdf. The paper is explicit that resampling is the common tactic and that the correction was not written down: "The most common method of achieving this objective is to rebalance the training set given to the learning algorithm, i.e. to change the proportion of positive and negative training examples in the training set. Although rebalancing is a common idea, the general formula for how to do it correctly has not been published." It then gives both directions — Theorem 1, how many negatives to multiply by to make a target threshold correspond to a given one, and Theorem 2 ("New probabilities given a new base rate"), which converts a probability estimated under one base rate to the probability under another. Cheaper alternative that avoids the whole problem: leave the data alone and move the decision threshold instead — scikit-learn, *Tuning the decision threshold* — https://scikit-learn.org/stable/modules/classification_threshold.html. See also the SMOTE principle in `evaluation.md`.

---

### A modern neural network is overconfident by default; temperature scaling is the cheap fix

**What it requires.** A neural classifier whose softmax output is consumed as a probability gets a temperature fitted on a validation set. One parameter, fitted after training, applied to the logits before the softmax.

**When it applies.** `softmax(logits)` used as a confidence value — an abstention rule ("only auto-resolve when confidence > 0.95"), a routing decision, or a number surfaced to a human reviewer.

**Why it bites.** The overconfidence is a property of the modern architecture, not of your training run — it got worse as networks got deeper and wider, and it is not fixed by more data. A network that is 99% confident is right rather less often than that, so a confidence-gated automation rule fires on cases it should have escalated. The failures concentrate exactly where the gate was supposed to protect you.

**Backing.** `source` — Guo, Pleiss, Sun and Weinberger, *On Calibration of Modern Neural Networks*, ICML 2017, arXiv:1706.04599 — https://arxiv.org/abs/1706.04599: "We discover that modern neural networks, unlike those from a decade ago, are poorly calibrated. Through extensive experiments, we observe that depth, width, weight decay, and Batch Normalization are important factors influencing calibration... on most datasets, temperature scaling -- a single-parameter variant of Platt Scaling -- is surprisingly effective at calibrating predictions." Note the direct contradiction with the 2005 result quoted above, which found neural nets of that era to be well calibrated; the architectures changed, the conclusion flipped. Implementation note: scikit-learn's `CalibratedClassifierCV` calibrates multiclass problems one-vs-rest and then renormalizes, whereas "temperature scaling naturally supports multiclass predictions by working with logits and finally applying the softmax function" — https://scikit-learn.org/stable/modules/calibration.html.

---

## What changed

1. **"Neural networks are well calibrated" is now false.** Niculescu-Mizil and Caruana (2005) measured neural nets as among the best-calibrated families; Guo et al. (2017) found the opposite for modern architectures and identified depth, width, weight decay and batch normalization as the causes. Both papers are cited above and both are correct about their own era — which is why the property must be *measured* on your model rather than inherited from a family reputation.
2. **A single calibration scalar lost its standing as evidence.** Reporting ECE or Brier alone was normal practice; current sources say the binned estimator understates its own error (Kumar et al., 2019 — https://arxiv.org/abs/1909.10155) and that proper scoring rules confound calibration with discrimination (scikit-learn — https://scikit-learn.org/stable/modules/calibration.html). The diagram is the deliverable now.
3. **The prefit calibration API changed shape.** scikit-learn now documents wrapping an already-fitted estimator as `CalibratedClassifierCV(estimator=FrozenEstimator(estimator))` rather than the older `cv='prefit'` idiom — https://scikit-learn.org/stable/modules/calibration.html. Behaviourally identical, but code review should not treat the old form as current.

---

## Sources I could not open or verify

1. **Platt (1999)**, the original of "Platt scaling", was not retrieved directly. Every claim about it here is quoted from Niculescu-Mizil and Caruana (2005), which was read in full from the PDF at https://www.cs.cornell.edu/~alexn/papers/calibration.icml05.crc.rev3.pdf, and from the scikit-learn calibration documentation. The primary reference is cited by both as Platt, *Probabilistic outputs for support vector machines*, 1999.
2. **Zadrozny and Elkan (2001, 2002)**, the origin of isotonic regression for calibration, likewise was not retrieved directly; it is cited here only as attributed by Niculescu-Mizil and Caruana ("Isotonic Regression: the method used by Zadrozny and Elkan (2002; 2001) to calibrate predictions from boosted naive bayes, SVM, and decision tree models").
3. **Elkan (2001) formulas**: the PDF at https://cseweb.ucsd.edu/~elkan/rescale.pdf opened and its prose was extracted cleanly, but the mathematical notation did not survive text extraction. The prose statements of Theorem 1 and Theorem 2 quoted above are verbatim; the formulas themselves are described in words rather than reproduced, deliberately, because a transcribed formula that lost a symbol would be worse than none.

**Date the sources in this file were consulted:** 16 August 2026.
