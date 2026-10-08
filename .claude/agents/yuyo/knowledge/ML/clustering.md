---
updated: 2026-08-16
ttl: 24 months
sources: 15
---

# Yuyo — ML: Clustering and Dimensionality Reduction

**What this covers.** Density clustering and partitional clustering, the reduction step that usually precedes them, how to evaluate a clustering when there are no labels, and how the cluster's representative gets chosen — which is the step that decides what a human or an LLM downstream actually reads. Out of scope: picking between clustering families for a product requirement (`selection.md`), and topic modeling over text, which stays in the NLP file because c-TF-IDF and topic coherence are text-specific.

**Origin note.** The first five principles were written for the NLP knowledge file and are migrated unchanged in substance, translated, with URLs and backing levels preserved. UMAP, HDBSCAN, silhouette and seed control operate on any feature matrix. The remaining five are new research.

**Backing scale.** Identical to the core file. A principle may carry two levels.

- **`source`** — official documentation, paper, or standard cited with a URL.
- **`evidence`** — a senior reviewer asked for it in a real PR of this repository, with a verbatim quote.
- **`consensus`** — accepted practice with no single citable source.
- **`debated`** — two legitimate positions; both are named and one is recommended with its tradeoff.

---

## 1. The reduction step

### Reducing with UMAP before clustering with HDBSCAN works, and the documentation itself calls it controversial

**What it requires.** If you reduce dimensionality before clustering, validate the result in the original space and declare the decision.

**When it applies.** HDBSCAN over 768- or 1536-dimensional embeddings returns almost everything as noise, and the response is to insert UMAP in the middle without validating.

**Why it bites.** Density clustering suffers the curse of dimensionality, so reducing genuinely helps; but reducing can also create structure that was not in the data, in which case you end up clustering the artifact. The example from the documentation itself is telling: on high-dimensional MNIST, HDBSCAN correctly classifies what it does group (ARI 0.998 over the assigned points) but assigns only 17% of the data.

**Backing.** `source + debated` — `umap-learn`, *Using UMAP for Clustering* — https://umap-learn.readthedocs.io/en/latest/clustering.html: "UMAP can be used as an effective preprocessing step to boost the performance of density based clustering. This is somewhat controversial, and should be attempted with care"; it attributes the 17% to the fact that "density based clustering tends to suffer from the curse of dimensionality". Method: McInnes, Healy and Melville, *UMAP*, arXiv:1802.03426 — https://arxiv.org/abs/1802.03426.
- *Position A:* reducing dimensionality makes density viable. *Position B:* reducing creates structure that is not there. **Recommendation:** reduce, but validate the clusters with the metric of interest computed in the original space. **Tradeoff:** one extra validation step in exchange for not publishing clusters that are an artifact.

---

### Do not read distances or sizes off the 2D scatter

**What it requires.** Quantitative conclusions come from the original embedding space, not the projection. The visualization is exploratory.

**When it applies.** A report saying "cluster A is far from B, so they are very different topics" with a UMAP scatter as the only evidence.

**Why it bites.** UMAP and t-SNE preserve neither density nor global distances and can create false tears inside clusters. The distance between two blobs is not a measure of how different the groups are, and a product conclusion based on the shape of the plot is a conclusion about the projection algorithm.

**Backing.** `source + debated` — `umap-learn`, *Using UMAP for Clustering* — https://umap-learn.readthedocs.io/en/latest/clustering.html: "UMAP, like t-SNE, does not completely preserve density […] it can also create false tears in clusters, resulting in a finer clustering than is necessarily present in the data". Quantitative critique: Chari and Pachter, *The specious art of single-cell genomics*, PLOS Computational Biology 2023, DOI 10.1371/journal.pcbi.1011288 — https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1011288, where they build an autoencoder that embeds the same data into arbitrary 2D shapes (an elephant, a flower) while preserving distances to a degree "not much different" from UMAP or t-SNE.
- *Position A (Chari and Pachter):* the properties of the 2D embedding are largely arbitrary. *Position B (majority use):* it remains a valid exploratory tool. **Recommendation:** plot to explore, measure in the original space (mean distance, silhouette, purity) to conclude.
- Reinforcement from an independent source: Wattenberg, Viégas and Johnson, *How to Use t-SNE Effectively*, Distill 2016 — https://distill.pub/2016/misread-tsne/, which demonstrates two of the same failure modes interactively: "you cannot see relative sizes of clusters in a t-SNE plot", because "t-SNE... naturally expands dense clusters, and contracts sparse ones, evening out cluster sizes"; and "the basic message is that distances between well-separated clusters in a t-SNE plot may mean nothing", because seeing the global geometry requires tuning perplexity, which is a single global parameter that cannot be right for clusters of different sizes at once.

---

### Initialize the projection informatively — UMAP's global-structure advantage was an initialization artifact

**What it requires.** t-SNE and UMAP are run with an informative initialization (PCA for t-SNE, `init='pca'`; Laplacian eigenmaps or PCA for UMAP), and a comparison between the two methods that does not control initialization is not a comparison.

**When it applies.** Observable: `TSNE(...)` with default or `init='random'`, especially in a diff that switches from t-SNE to UMAP citing better preservation of global structure. Also: any claim in a PR that "UMAP is more stable across runs".

**Why it bites.** The widely repeated claim that UMAP preserves global structure better than t-SNE was traced to the two libraries having different *defaults*, not different algorithms: t-SNE implementations initialized randomly, UMAP did not. So a team migrates a pipeline to a new dependency, gets a nicer-looking plot, and attributes it to the method — when the same change would have come from one keyword argument. The migration cost is real, the improvement is not attributable, and the next comparison inherits the same confusion.

**Backing.** `source` — Kobak and Linderman, *Initialization is critical for preserving global data structure in both t-SNE and UMAP*, Nature Biotechnology 39, 156–157 (published 1 February 2021) — https://www.nature.com/articles/s41587-020-00809-z: "we show that this alleged superiority of UMAP can be entirely attributed to different choices of initialization in the implementations used by Becht et al.: the t-SNE implementations by default used random initialization, while the UMAP implementation used a technique called Laplacian eigenmaps (LE) to initialize the embedding. We show that UMAP with random initialization preserves global structure as poorly as t-SNE with random initialization, while t-SNE with informative initialization performs as well as UMAP with informative initialization. On the basis of these observations, we argue that there is currently no evidence that the UMAP algorithm per se has any advantage over t-SNE in terms of preserving global structure. We also contend that these algorithms should always use informative initialization by default." scikit-learn's t-SNE documentation now states the same mitigation: "Global structure is not explicitly preserved. This problem is mitigated by initializing points with PCA (using `init='pca'`)" — https://scikit-learn.org/stable/modules/manifold.html.

---

### Use PCA when you need the reduction to be cheap, deterministic and reusable; use t-SNE or UMAP only to look

**What it requires.** Separate the two jobs. A reduction that feeds a model, an index, or a stored feature is linear and deterministic (PCA or truncated SVD): it can be fitted once, applied to new points, and inverted. A reduction that feeds a human eye can be t-SNE or UMAP, and its output does not get persisted as a feature.

**When it applies.** Observable: a UMAP or t-SNE embedding written to a database column, used as a model input, or recomputed per request. Also: `TSNE` on a dataset large enough that the fit dominates the job's runtime.

**Why it bites.** Three properties differ and all three matter operationally. Cost: t-SNE on a million rows is hours where PCA is minutes. Determinism: the nonlinear methods are stochastic, so the stored feature changes meaning on every recompute, silently invalidating anything fitted on the previous version. Transform: `TSNE` has no meaningful `transform` for unseen points, so a "reduce then serve" design has no serving path at all and gets discovered at integration time.

**Backing.** `source` — scikit-learn, *Manifold learning*, t-SNE disadvantages — https://scikit-learn.org/stable/modules/manifold.html: "t-SNE is computationally expensive, and can take several hours on million-sample datasets where PCA will finish in seconds or minutes. The Barnes-Hut t-SNE method is limited to two or three dimensional embeddings. The algorithm is stochastic and multiple restarts with different seeds can yield different embeddings. However, it is perfectly legitimate to pick the embedding with the least error. Global structure is not explicitly preserved." The same page's practical tips note that manifold methods are nearest-neighbour based and therefore require "the same scale is used over all features", and that "noisy data can 'short-circuit' the manifold, in essence acting as a bridge between parts of the manifold that would otherwise be well-separated" — a failure that looks like two clusters merging.

---

## 2. Density clustering

### HDBSCAN's noise is a design output, and it is controlled with `min_samples`

**What it requires.** Before changing algorithm because of excessive noise, separate `min_samples` from `min_cluster_size` and lower it.

**When it applies.** 70% of the documents come out with label `-1` and the reflex is to change algorithm.

**Why it bites.** HDBSCAN leaves points unassigned on purpose: it prefers not to classify over classifying wrongly. Switching to an algorithm that assigns everything improves nothing, it only hides the uncertainty by assigning the doubtful points to some cluster — and those are exactly the ones that are later read as "the clustering grouped things that do not go together".

**Backing.** `source` — `hdbscan`, *FAQ* — https://hdbscan.readthedocs.io/en/latest/faq.html: "the amount of data classified as noise is controlled by the `min_samples` parameter. By default, if it is unspecified, this value is set to the same value as `min_cluster_size`". And *Parameter Selection* — https://hdbscan.readthedocs.io/en/latest/parameter_selection.html: "The larger the value of `min_samples` you provide, the more conservative the clustering – more points will be declared as noise, and clusters will be restricted to progressively more dense areas." Foundation: *How HDBSCAN Works* — https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html. scikit-learn's own HDBSCAN description states the companion half: `min_cluster_size` "specifies that during the hierarchical clustering, components with fewer than `minimum_cluster_size` many samples are considered noise" — https://scikit-learn.org/stable/modules/clustering.html.

---

### Fix the seed, or accept that two runs are not comparable

**What it requires.** Any pipeline with stochastic components sets `random_state` when the result is compared across runs.

**When it applies.** The number of clusters changes between runs and someone interprets it as "the data changed". A comparison of configuration A against B with no fixed seed.

**Why it bites.** The observed difference between two configurations may be pure noise from the dimensionality reduction. Without a seed no comparison is conclusive and the team argues about noise for days.

**Backing.** `source` — BERTopic, *FAQ: Why are the results not consistent between runs?* — https://maartengr.github.io/BERTopic/faq.html: "due to the stochastic nature of UMAP, the results from BERTopic might differ even if you run the same code multiple times. (…) If you want to reproduce the results, at the expense of performance, you can set a `random_state` in UMAP", with the example `UMAP(n_neighbors=15, n_components=5, min_dist=0.0, metric='cosine', random_state=42)`. The same warning appears for t-SNE in scikit-learn: "The algorithm is stochastic and multiple restarts with different seeds can yield different embeddings" — https://scikit-learn.org/stable/modules/manifold.html.

---

## 3. Evaluating without labels

### Silhouette is not a neutral judge between clustering algorithms

**What it requires.** Internal indices are not used to choose between algorithm families with different geometries.

**When it applies.** The decision "we use k-means because it has a better silhouette" is about to be made.

**Why it bites.** Internal indices reward convex shapes: comparing k-means against HDBSCAN with silhouette or Davies-Bouldin structurally favours the former, regardless of which one groups better. If the expected clusters are not spheres — and in most real feature spaces they are not — the index is measuring the shape, not the quality.

**Backing.** `source` — scikit-learn, *Clustering performance evaluation* — https://scikit-learn.org/stable/modules/clustering.html. The statement is now verifiable verbatim for all three centroid-style indices on that page. Silhouette Coefficient, Drawbacks: "The Silhouette Coefficient is generally higher for convex clusters than other concepts of clusters, such as density based clusters like those obtained through DBSCAN." Calinski-Harabasz, Drawbacks: "The Calinski-Harabasz index is generally higher for convex clusters than other concepts of clusters, such as density based clusters like those obtained through DBSCAN." Davies-Bouldin, Drawbacks: "The Davies-Bouldin index is generally higher for convex clusters than other concepts of clusters, such as density-based clusters like those obtained from DBSCAN. The usage of centroid distance limits the distance metric to Euclidean space." The same page names the matching failure for k-means's own objective: "Inertia makes the assumption that clusters are convex and isotropic, which is not always the case. It responds poorly to elongated clusters, or manifolds with irregular shapes." (Migration note: the NLP file recorded this silhouette bullet as unverifiable and fell back to quoting the Davies-Bouldin one. It has now been retrieved directly from the page and is quoted above.)

---

### Score a density-based clustering with DBCV, not with silhouette

**What it requires.** When the clustering is density-based (DBSCAN, HDBSCAN), the internal validity score is a density-based one — `hdbscan.validity.validity_index`, which implements DBCV — computed with the noise points handled explicitly rather than silently dropped.

**When it applies.** A `silhouette_score(X, hdbscan_labels)` call. Notice what that does: `-1` is treated as if it were a real cluster, so the score is computed over a "cluster" made of every point the algorithm refused to assign — a group with no cohesion by construction.

**Why it bites.** The number comes out low, and the low number gets read as "the clustering is bad", so someone tunes `min_cluster_size` to make silhouette go up. That tuning drives the pipeline toward convex, evenly-sized clusters — precisely the structure silhouette rewards and precisely what you chose a density method to avoid. The metric quietly converts your density clustering into a worse k-means.

**Backing.** `source` — `hdbscan` API reference — https://hdbscan.readthedocs.io/en/latest/api.html: `hdbscan.validity.validity_index(X, labels, metric='euclidean', ...)` "Compute the density based cluster validity index for the clustering specified by labels and for each cluster in labels", with `per_cluster_scores` available so you can see which cluster is dragging the score. The page cites the method as Moulavi, Jaskowiak, Campello, Zimek and Sander, *Density-Based Clustering Validation*, SDM 2014, pp. 839–847. Complementary: the scikit-learn drawback bullets quoted in the previous principle establish why the convex indices are the wrong instrument here — https://scikit-learn.org/stable/modules/clustering.html.

---

### Report cluster stability across resamples before you report the number of clusters

**What it requires.** "We found k clusters" is supported by re-running the clustering on bootstrapped or subsampled data and reporting how consistently the partition reproduces — not by a single run, and not by a single index maximized over k.

**When it applies.** A PR whose headline is a cluster count ("the tickets fall into 7 themes") based on one run. Also: an elbow or silhouette-vs-k plot presented as the derivation of k.

**Why it bites.** Clustering is unsupervised, so there is no held-out set to contradict you; a single run is unfalsifiable by construction. Stability is the closest available substitute for validation, and it frequently disagrees with the index: a k that maximizes silhouette can be wildly unstable, meaning that a rerun next month on next month's data will produce a different count and the "themes" the business built a process around will not exist. Discovering that after the process is built is much more expensive than one extra afternoon of resampling.

**Backing.** `source + debated` — von Luxburg, *Clustering Stability: An Overview*, arXiv:1007.1075 (2010) — https://arxiv.org/abs/1007.1075: "A popular method for selecting the number of clusters is based on stability arguments: one chooses the number of clusters such that the corresponding clustering results are 'most stable'. In recent years, a series of papers has analyzed the behavior of this method from a theoretical point of view. However, the results are very technical and difficult to interpret for non-experts."
- *Position A:* stability is the right selection criterion for k in the absence of labels.
- *Position B (the caveat von Luxburg's own survey exists to explain):* the theory shows stability-based selection does not behave uniformly well — in some regimes it identifies the right k, in others it is driven by artifacts of the algorithm rather than by structure in the data.
- **Recommendation:** use stability as a *veto*, not as a selector. Do not use it to pick k; use it to reject a k whose partition does not reproduce. **Tradeoff:** a resampling loop against publishing a cluster count that will not exist next quarter.

---

## 4. Representatives

### Say how the cluster representative is chosen, and prefer a real data point over a centroid

**What it requires.** Any pipeline that reduces a cluster to something a human or an LLM will read states which of three things it emits: the **centroid** (the mean vector — usually not a real record), the **medoid** (the member minimizing total distance to the other members), or the **nearest-to-centroid** member (a real record, but the one closest to a synthetic point). The choice is written down, because it changes the output.

**When it applies.** Highly observable: any `cluster_centers_` fed into a decoder, a nearest-neighbour lookup, or a prompt; any "pick one example per cluster to show the user"; any summarization step that receives k items chosen from k clusters.

**Why it bites.** The three are not interchangeable and the difference lands entirely on the reader. A centroid is an average, and the average of a set of real records is generally not a realizable record — decoding it or nearest-neighbour-ing it produces a plausible-looking item that no one ever actually submitted, which then gets quoted in a report as an example. A medoid is a real member and is robust to a few outliers dragging the mean. Nearest-to-centroid is a real member too, but it inherits the mean's sensitivity: one extreme outlier moves the centroid, and the "representative" jumps to a different, unrepresentative record. On a non-convex or multi-modal cluster the mean can sit in empty space *between* the modes, so the nearest real point to it is a boundary case — the least representative member available. Downstream, an LLM handed that item summarizes the wrong thing with full confidence, and nobody can trace the summary back to the choice of representative because that choice was never named.

**Backing.** `source` — scikit-learn, *Clustering*, K-means — https://scikit-learn.org/stable/modules/clustering.html states the centroid property directly: "The means are commonly called the cluster 'centroids'; note that they are not, in general, points from \(X\), although they live in the same space." The medoid alternative returns real records: `sklearn_extra.cluster.KMedoids` — https://scikit-learn-extra.readthedocs.io/en/stable/generated/sklearn_extra.cluster.KMedoids.html — documents its cluster centers as "medoids (elements from the original dataset)" and exposes `medoid_indices_`, "The indices of the medoid rows in X". For density clusterings, where a single center is the wrong shape of answer, `hdbscan` uses a *set* of exemplars instead and explains why: "we need some notion of exemplar point for each cluster to measure distance to. This is tricky since our clusters may have off shapes. In practice there isn't really any single clear exemplar for a cluster. The right solution, then, is to have a set of exemplar points for each cluster... They should be the points that persist in the cluster (and its children in the HDBSCAN condensed tree) for the longest range of lambda values – such points represent the 'heart' of the cluster" — https://hdbscan.readthedocs.io/en/latest/soft_clustering_explanation.html.
- Practical default: **medoid or exemplar set for anything a human or an LLM reads; centroid only for arithmetic that stays inside the algorithm.** If you keep the centroid, never present its nearest neighbour as "a typical example" without saying that is what it is.

---

## What changed

1. **"UMAP preserves global structure better than t-SNE" was retracted as a method claim.** The difference was traced entirely to default initialization in the implementations compared, not to the algorithms (Kobak and Linderman, 2021 — https://www.nature.com/articles/s41587-020-00809-z). Any migration justified on that basis should be re-justified.
2. **The silhouette drawback is now quotable verbatim from scikit-learn.** The NLP knowledge file recorded this as an unverifiable citation and substituted the Davies-Bouldin bullet. The Silhouette bullet has since been retrieved from https://scikit-learn.org/stable/modules/clustering.html and is quoted above, so the substitution is no longer needed; the same wording also applies to Calinski-Harabasz.
3. **Density clusterings got a purpose-built validity index, and it is in the library people already have.** `hdbscan.validity.validity_index` (DBCV) has been shipping in the `hdbscan` package for years — https://hdbscan.readthedocs.io/en/latest/api.html — while `silhouette_score` on HDBSCAN labels remains the common default. The tooling changed; the habit has not.

---

## Sources I could not open or verify

*The `sources: 15` count in this file's header is the number of URLs cited as backing. The SIAM URL below appears in the text but is deliberately not counted, because it did not open.*

1. **Moulavi et al., *Density-Based Clustering Validation*, SDM 2014** (DOI 10.1137/1.9781611973440.96): the SIAM page at https://epubs.siam.org/doi/10.1137/1.9781611973440.96 returned **HTTP 403**. The DBCV claims above are cited from the `hdbscan` API documentation, which was read in full and which carries the complete reference (SDM 2014, pp. 839–847) and the function contract. The paper's own text was not read.
2. **Kobak and Linderman (2021)**: the abstract-and-argument section quoted above was retrieved in full from the Nature Biotechnology page, but the article body is behind a paywall. Everything quoted comes from the freely visible portion; no claim is made about the figures or the methods section.
3. **`scikit-learn-extra` maintenance status**: the `KMedoids` documentation page opened and the two attribute descriptions quoted above are verbatim, but the page does not contain the comparative statements about k-medoids versus k-means (objective function, outlier robustness) that are widely attributed to it. Those are stated here from the definition of a medoid, not attributed to that page. Before adding the dependency, check whether the package is still maintained against your scikit-learn version.
4. **Chari and Pachter, and the umap-learn/hdbscan/BERTopic pages**, are carried over from the NLP file where they were verified on 15 August 2026; they were not re-fetched for this file except where a new quote was added (the scikit-learn clustering and manifold pages, both re-read on 16 August 2026).

**Date the sources in this file were consulted:** 15–16 August 2026 (migrated principles, 15 August; new research and the scikit-learn re-reads, 16 August).
