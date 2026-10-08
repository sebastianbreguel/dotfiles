---
updated: 2026-08-16
ttl: 24 months
sources: 8
---

# Yuyo — ML: Algorithm Selection

**What this covers.** How to choose a model family for a problem, and how to defend the choice in review. Deliberately out of scope: how to build the chosen model (`construction.md`), how to turn its scores into probabilities (`calibration.md`), how to measure it (`evaluation.md`), and clustering internals (`clustering.md`).

**What this deliberately is not.** This file holds **decision criteria, never a catalog of the currently-best models.** A criterion — "does the deployment let you retrain inside the incident window?" — is still true in three years. A ranked list of gradient boosting libraries is stale in three months and, worse, is stale silently: nobody re-reads a knowledge file to check whether its recommendation expired. If you find yourself wanting to add "use X, it is the best right now", write the property of X that made it win instead.

**Backing scale.** Identical to the core file. A principle may carry two levels.

- **`source`** — official documentation, paper, or standard cited with a URL.
- **`evidence`** — a senior reviewer asked for it in a real PR of this repository, with a verbatim quote.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both are named and one is recommended with its tradeoff.

---

## 1. Model family by problem shape

### Start from a tree ensemble on tabular data and make the deep alternative earn its place

**What it requires.** On a table of rows and typed columns, the first serious model is a gradient-boosted tree ensemble or a random forest. A neural network enters only with a benchmark against that ensemble on the same data, with the tuning budget of both reported.

**When it applies.** A diff that introduces a neural architecture whose input is a feature matrix assembled from database columns — numeric, categorical, dates — and whose training set is on the order of tens of thousands of rows or fewer. Observable in code: a `torch.nn.Module` or a Keras model fed by a `DataFrame` with no image, audio, or free text going in.

**Why it bites.** The deep model usually ties or loses, but it costs a GPU in the training path, a heavier serving image, and a tuning loop nobody wants to rerun. The failure is not a wrong prediction; it is a permanently more expensive system that produces the same number, discovered six months later when someone tries to retrain it and cannot.

**Backing.** `source + debated` — Grinsztajn, Oyallon and Varoquaux, *Why do tree-based models still outperform deep learning on tabular data?*, arXiv:2207.08815 (submitted 18 July 2022) — https://arxiv.org/abs/2207.08815: across a standardized set of 45 tabular datasets, "tree-based models remain state-of-the-art on medium-sized data ($\sim$10K samples) even without accounting for their superior speed". The paper attributes the gap to three inductive biases a tabular NN would have to acquire: be "robust to uninformative features", "preserve the orientation of the data", and "be able to easily learn irregular functions". Corroborating: Shwartz-Ziv and Armon, *Tabular Data: Deep Learning is Not All You Need*, arXiv:2106.03253 — https://arxiv.org/abs/2106.03253: "XGBoost outperforms these deep models across the datasets, including the datasets used in the papers that proposed the deep models. We also demonstrate that XGBoost requires much less tuning."
- *Position A (Grinsztajn et al., Shwartz-Ziv and Armon):* on medium-sized tables, trees win on accuracy and on cost, so deep learning needs a specific justification.
- *Position B (prior-fitted / in-context tabular models):* a pretrained transformer can classify a small table in one forward pass with no hyperparameter tuning at all — Hollmann et al., *TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second*, arXiv:2207.01848 — https://arxiv.org/abs/2207.01848 report "up to 230× speedup" over AutoML systems on OpenML-CC18, "5 700× speedup when using a GPU".
- **Recommendation:** tree ensemble as the model to beat; a deep or pretrained tabular model only with a measured win on your data, including its serving cost. **Tradeoff:** one extra benchmark run against carrying an architecture whose advantage was never demonstrated on your rows.

---

### Choose a linear model when the coefficient itself has to be defensible

**What it requires.** When a human will be asked *why* a given row got its score — a rejected application, a flagged account, a prioritized ticket — the default is logistic regression (or another additive model), not a black box plus a post-hoc explainer.

**When it applies.** Two observable triggers. First: the training set is small enough that the flexible model's variance dominates — hundreds to low thousands of rows, especially with more features than that. Second, and more important: the codebase contains a SHAP/LIME call whose output is rendered to an end user or an operator as the reason for a decision.

**Why it bites.** A post-hoc explanation of a black box is a second model approximating the first; it can be locally faithful and globally wrong, and nobody notices because there is nothing to compare it against. When the decision is contested — by a customer, by an auditor — you are defending an approximation of an approximation. With a linear model the coefficient *is* the explanation, and it is the same object the model actually used.

**Backing.** `source + debated` — Rudin, *Stop Explaining Black Box Machine Learning Models for High Stakes Decisions and Use Interpretable Models Instead*, Nature Machine Intelligence 1, 206–215 (May 2019) — https://arxiv.org/abs/1811.10154: "trying to explain black box models, rather than creating models that are interpretable in the first place, is likely to perpetuate bad practices and can potentially cause catastrophic harm to society. There is a way forward -- it is to design models that are inherently interpretable."
- *Position A (Rudin):* for high-stakes decisions, do not explain a black box; use an interpretable model, and the accuracy cost is usually small or zero.
- *Position B (common practice):* keep the ensemble and attach an explainer, because the accuracy delta is real and the explainer is cheap to add.
- **Recommendation:** interpretable model whenever the score is shown to the person it affects or reviewed by a regulator; ensemble plus explainer only for internal ranking where no one is owed a reason. **Tradeoff:** a few points of held-out metric against an explanation you can actually defend line by line.

---

### Reach for an SVM when features outnumber rows, and drop it when rows grow

**What it requires.** A support vector machine is a legitimate default in the wide-and-short regime — many features, few samples. It stops being one as soon as the training set grows, and the review should state which regime the data is in.

**When it applies.** `SVC(kernel='rbf')` in a training script. Check the shape of `X`: if `n_samples` is in the tens of thousands or more, the choice needs a justification. Also observable: `SVC(probability=True)`, which quietly adds an internal five-fold cross-validation to every fit.

**Why it bites.** The kernel SVM's training cost is superlinear in the number of rows, so a model that fit in two minutes on the prototype extract takes hours on the full table, and the retraining job starts timing out in CI with no code change. The second bite is at serving time: a kernel SVM scores a new point against its stored support vectors, so inference cost grows with how hard the problem was, not with how big the model file looks.

**Backing.** `source` — scikit-learn, *Support Vector Machines* — https://scikit-learn.org/stable/modules/svm.html. Advantages: "Effective in high dimensional spaces. Still effective in cases where number of dimensions is greater than the number of samples. Uses a subset of training points in the decision function (called support vectors), so it is also memory efficient." Disadvantages: "If the number of features is much greater than the number of samples, avoid over-fitting in choosing Kernel functions and regularization term is crucial. SVMs do not directly provide probability estimates, these are calculated using an expensive five-fold cross-validation." Complexity: the libsvm QP solver "scales between \(O(n_{features} \times n_{samples}^2)\) and \(O(n_{features} \times n_{samples}^3)\)", while `LinearSVC` via liblinear "can scale almost linearly to millions of samples and/or features".

---

### Pick the clustering algorithm by two questions: do you know k, and is "no cluster" a valid answer

**What it requires.** The choice between KMeans and HDBSCAN is not a matter of taste. KMeans requires you to supply the number of clusters and assigns every point to one of them. HDBSCAN infers the count and is allowed to answer "this point belongs to nothing". Pick by which of those two behaviours the product needs.

**When it applies.** A `KMeans(n_clusters=8)` where the 8 has no derivation — no elbow plot, no business constraint like "we have eight support queues". Or the reverse: an HDBSCAN over data where every row genuinely belongs somewhere and a large `-1` bucket would break the consumer downstream.

**Why it bites.** KMeans with an invented k always returns k clusters, including on data that has none; the output looks like structure and is a partition of noise. HDBSCAN on data where everything must be labelled returns a large unassigned bucket that the downstream consumer was not designed to receive, and someone "fixes" it by assigning noise to the nearest cluster, which is exactly the behaviour KMeans would have given for free — with the extra cost of a density algorithm.

**Backing.** `source` — scikit-learn, *Clustering*, overview of clustering methods table — https://scikit-learn.org/stable/modules/clustering.html. K-Means: parameter "number of clusters", use case "General-purpose, even cluster size, flat geometry, not too many clusters, inductive". HDBSCAN: parameters "minimum cluster membership, minimum point neighbors", use case "Non-flat geometry, uneven cluster sizes, outlier removal, transductive, hierarchical, variable cluster density". Note the word *inductive* on KMeans and *transductive* on HDBSCAN: KMeans can assign a new point without refitting, HDBSCAN in general cannot. That is a serving-cost difference, not only a modelling one. See `clustering.md` for how to evaluate whichever you pick.

---

## 2. The axis people forget: cost to retrain and cost to serve

### Budget the retraining loop before you pick the model, not after the first incident

**What it requires.** The selection writes down how long a full retrain takes, what hardware it needs, and who can trigger it. A model that cannot be retrained inside the window in which its failure matters is the wrong model regardless of its held-out score.

**When it applies.** Any model choice whose input distribution moves — prices, product catalogs, user behaviour, fraud patterns. Observable in code: a training entry point that requires a GPU, or a tuning search whose configured budget implies hours, in a repository whose deployment story is a container that must rebuild to ship a new artifact.

**Why it bites.** The first time the data shifts, the fix is "retrain". If retraining means finding a GPU, rediscovering the hyperparameters, and waiting overnight, the actual response is to leave the stale model running and file a ticket. Accuracy chosen at selection time silently becomes accuracy you cannot restore. The cost also compounds: an ML system accumulates data dependencies and configuration that make each retrain a little more expensive than the last.

**Backing.** `source` — Sculley et al., *Hidden Technical Debt in Machine Learning Systems*, NeurIPS 2015 — https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html: "it is dangerous to think of these quick wins as coming for free. Using the software engineering framework of technical debt, we find it is common to incur massive ongoing maintenance costs in real-world ML systems", listing "data dependencies, configuration issues, changes in the external world" among the risk factors. On tuning cost specifically, Shwartz-Ziv and Armon (arXiv:2106.03253 — https://arxiv.org/abs/2106.03253) report that XGBoost "requires much less tuning" than the deep tabular models they compared, which is a retraining-cost result, not an accuracy one.

---

### Treat inference cost as a property of the algorithm, not of the hardware

**What it requires.** The selection states what one prediction costs: how much of the model must be touched, whether the cost grows with training set size, and whether a new point can be scored without refitting.

**When it applies.** Any model on a synchronous request path (an API endpoint, a webhook handler, a queue consumer with a visibility timeout). Observable in code: `model.predict` inside a request handler rather than inside a batch job.

**Why it bites.** The three families degrade differently and the difference is invisible in a notebook. A linear model is a dot product and stays flat. A tree ensemble is a fixed number of comparisons per tree and stays predictable. A kernel SVM scores against its support vector set, so its latency is set by how hard the training problem was — and the count of support vectors is not something you chose. A transductive clusterer has no cheap "predict" at all: assigning a new point may require refitting. The bill arrives as p99 latency on a Friday, and by then the model is load-bearing.

**Backing.** `source` — scikit-learn, *Support Vector Machines*, "Uses a subset of training points in the decision function (called support vectors)" and the complexity section — https://scikit-learn.org/stable/modules/svm.html. On the inductive/transductive distinction, the clustering overview table — https://scikit-learn.org/stable/modules/clustering.html. On why speed belongs in the comparison at all rather than as a footnote, Grinsztajn et al. — https://arxiv.org/abs/2207.08815 — state their result holds "even without accounting for their superior speed", i.e. speed was a further advantage they set aside; in a production selection you do not get to set it aside.

---

### Record the criteria that selected the model, not the name of the model

**What it requires.** The PR that introduces a model leaves behind the properties that made it win — data shape, interpretability requirement, retrain window, latency budget — and a trigger that says when to re-open the decision (for example: "revisit if the training set passes 500k rows" or "revisit if the score starts being shown to customers").

**When it applies.** Any PR adding or replacing a model. Observable absence: a diff that adds an estimator and a metric number, with no statement of what the alternative was or why it lost.

**Why it bites.** Six months later someone asks "why gradient boosting and not a neural net?" and the honest answer is "because that is what was in the notebook". Without recorded criteria the decision cannot be revisited rationally: it gets either defended out of inertia or overturned out of fashion, and both are guesses. Worse, a knowledge base that records *which model is best* rots invisibly, because a stale recommendation looks exactly like a fresh one; a recorded criterion at least fails loudly when its trigger fires.

**Backing.** `consensus` — this is the reason the rest of this file is written as criteria. It is consistent with the documentation practice of Model Cards (Mitchell et al., FAT* 2019 — https://arxiv.org/abs/1810.03993), which asks a released model to state its intended use context and evaluation conditions, but the narrow claim here — record the selection criteria and a re-evaluation trigger — is a review convention, not a cited finding.

---

## What changed

1. **"Deep learning will eventually take tabular data too" is not what the benchmarks show.** The 2022 evidence, with a controlled hyperparameter budget across 45 datasets, still puts tree ensembles ahead on medium-sized tables (Grinsztajn et al. — https://arxiv.org/abs/2207.08815). The live counter-current is not deeper architectures but pretrained in-context tabular models (TabPFN — https://arxiv.org/abs/2207.01848), which is a different claim and needs to be evaluated on its own terms.
2. **"Use a black box and explain it afterwards" lost its default status for high-stakes decisions.** The argument moved from "explainability is a feature you add" to "post-hoc explanation of a black box is itself an unvalidated model" (Rudin, 2019 — https://arxiv.org/abs/1811.10154).

---

## Sources I could not open or verify

Nothing in this file is cited from a source that failed to open. Two notes on what is *not* claimed:

1. **The Nature (2025) journal version of TabPFN** was not retrieved: `nature.com` returned a 303 redirect to an identity-provider URL. The TabPFN claims above are cited from the 2022 arXiv preprint (arXiv:2207.01848), which opened in full, and are labelled as a preprint claim rather than as the peer-reviewed version.
2. **No benchmark numbers for specific gradient boosting libraries** (XGBoost vs LightGBM vs CatBoost) are given here on purpose. They are exactly the kind of fact that ages in months; the criteria above are what survives.

**Date the sources in this file were consulted:** 16 August 2026.
