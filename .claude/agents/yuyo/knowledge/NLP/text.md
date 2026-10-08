---
updated: 2026-08-16
ttl: 24 months
sources: 16
---

# Yuyo — NLP / Text: encoding, canonicalization, noise and text measurement

**What it covers.** The text itself before anything is modeled on top of it: Unicode normalization, compatibility forms, grapheme clusters, mojibake, accent stripping, typing and transcription noise, near-duplicate detection, language identification and per-language reporting, and the measurement of text datasets and text systems (annotator agreement, statistical power, behavioral tests, BLEU/ROUGE).

**When to read it.** When the diff touches text cleanup or normalization, a deduplication key, a character-based truncation, a language router, an annotation pipeline, or a metric over generated text. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `TX<n>`. Cross-file references name the file (`NLP/tokenization.md` TK4, `NLP/representations.md` RP6, `LLM/retrieval.md` D8, `ML/evaluation.md`).

**Note on the distribution of backings in this specialty.** Almost everything here is `source` and almost nothing is `evidence`: the team reviews prompts and guards in great detail, but there is no record of anyone asking for anything about encoding, embeddings, splits or classification metrics. That does not weaken the principles — they are better backed than average because there is a paper or official documentation behind them — but it changes how they are framed: you explain the mechanism and cite the source, you do not invoke local precedent that does not exist.

---

## TX1. Normalize to Unicode NFC at the input boundary

**What it requires.** Text is normalized to NFC at the point where it enters the system, before comparing, indexing or using it as a key.

**When it applies.** Any point where text comes in and is later compared or grouped: parsing a webhook, loading a CSV, reading a form field, building a deduplication key. Symptom in a notebook: `len(df.name.unique())` gives more values than you can see by eye, or a `merge` by name loses rows that should match.

**Why it bites.** Two strings that look identical can be different code point sequences (`é` as a single character, or as `e` plus a combining accent). Without normalization, equality, `GROUP BY` and deduplication fail silently: there is no error, there are extra rows.

**Backing.** `source` — Unicode Standard Annex #15, *Unicode Normalization Forms*, section 1.2 — https://unicode.org/reports/tr15/. The standard notes that the *W3C Character Model for the World Wide Web 1.0: Normalization* and other W3C specifications recommend NFC for all content, "because this form avoids potential interoperability problems arising from the use of canonically equivalent, yet different, character sequences".

---

## TX2. Reserve NFKC for the moment you accept losing information

**What it requires.** NFC in the data column; NFKC (or another compatibility form) only in the derived search column or index. They are not interchangeable.

**When it applies.** A `unicodedata.normalize('NFKC', text)` over the column that is later shown to the user or returned to the client.

**Why it bites.** NFC preserves the distinction between compatibility-equivalent characters; NFKC collapses it. That is useful for search (so the ligature and the three letters match) and destructive for storage: the original form of the user's data is lost and there is no way to recover it.

**Backing.** `source` — UAX #15, sections 1.2 and 6 — https://unicode.org/reports/tr15/. Table 7 shows that under NFD/NFC the `ffi` ligature (U+FB03) does not decompose and neither does the Roman numeral IV (U+2163); Table 8 shows that under NFKD/NFKC those same strings do end up equal. The composition phase of NFC and NFKC is the same: only the decomposition phase differs.

---

## TX3. Count characters in grapheme clusters, not in code points

**What it requires.** Truncating, counting or reversing text is done over extended grapheme clusters, the unit corresponding to a "user-perceived character".

**When it applies.** A `text[:280]`, a `.length` to validate message length, a character counter in the UI, or any character-based truncation over content that may carry emoji. Smoke test: send a family or flag emoji and verify that the reported length and the truncation do not break it.

**Why it bites.** What the user perceives as one character can be several code points: a base letter plus combining marks, or an emoji composed with ZWJ and skin tone modifiers. Cutting by code point splits those sequences in half and produces corrupt text that then travels into a prompt, a sent message or a column.

**Backing.** `source` — Unicode Standard Annex #29, *Unicode Text Segmentation* — https://unicode.org/reports/tr29/ (defines the extended grapheme cluster with normative boundary rules). Complemented by Unicode Technical Standard #51, *Unicode Emoji*, section 2.6.2 — https://www.unicode.org/reports/tr51/, on skin tone modifiers and multi-person ZWJ sequences rendered as a single image. It is the concrete counterpart of C16 (every truncation is a decision).

---

## TX4. Repair mojibake before blaming the model

**What it requires.** Text arriving from old integrations is inspected and repaired before entering a model, an index or a metric. It is a repair of the encoding chain, not a modeling problem.

**When it applies.** Seeing `Ã©`, `â€™` or `Â` in a sample of the dataset. A pipeline that consumes text from a legacy integration with no cleanup step.

**Why it bites.** Mojibake (UTF-8 read as Latin-1 and re-encoded) is not fixed by a better model: it degrades tokenization, embeddings and matching, and the aggregate metric never detects it. A review of 200 random rows costs minutes — it is the concrete case of C2.

**Backing.** `source` — `ftfy` (*fixes text for you*), official documentation — https://ftfy.readthedocs.io/en/latest/, with dedicated pages for "Fixing problems and getting explanations", "Configuring ftfy" and "Encodings ftfy can handle".

---

## TX5. Stripping accents is a search transformation, not a storage one

**What it requires.** The data is stored intact; accents are resolved in the full-text search configuration or in a derived column or index.

**When it applies.** Somebody proposes storing the name without accents "so search works", or an `UPDATE` that destructively normalizes a data column.

**Why it bites.** You lose the original form the client wrote, and with it the ability to give it back to them correctly. Besides, the problem is better solved where it belongs: in PostgreSQL, `unaccent` is not just any `LOWER()`, it is a text search dictionary that plugs into an FTS configuration.

**Backing.** `source` — PostgreSQL 18, *F.48. unaccent* — https://www.postgresql.org/docs/current/unaccent.html. The canonical pattern from that page: `CREATE TEXT SEARCH CONFIGURATION fr (COPY = french)` and then `ALTER TEXT SEARCH CONFIGURATION fr ALTER MAPPING FOR hword, hword_part, word WITH unaccent, french_stem`, so that `to_tsvector('fr','Hôtels de la Mer')` already comes out without diacritics. The `unaccent()` function is described as "basically a wrapper around `unaccent`-type dictionaries, but it can be used outside normal text search contexts".

---

## TX6. Budget for typing and transcription noise as part of the real distribution

**What it requires.** If the input comes from chat, from a mobile form or from a transcript, the evaluation set has to include that noise. Before training or accepting a number, a noisy variant of the test set is generated and the results are compared.

**When it applies.** An evaluation set built by copying text from a clean document, when the real channel is WhatsApp or a transcribed call.

**Why it bites.** Models trained on clean text degrade sharply against typos, letter transpositions and keyboard noise that cost a human almost nothing. It is measured, not folklore: if the eval has no noise, it is not measuring production.

**Backing.** `source` — Belinkov and Bisk, *Synthetic and Natural Noise Both Break Neural Machine Translation*, arXiv:1711.02173 — https://arxiv.org/abs/1711.02173. For voice-specific noise: Radford et al., *Robust Speech Recognition via Large-Scale Weak Supervision* (Whisper), arXiv:2212.04356 — https://arxiv.org/abs/2212.04356.

---

## TX7. Detect near-duplicates in the corpus

**What it requires.** A deduplication pass over the text: hash the normalized text and count collisions, then a similarity pass (MinHash or trigrams) for the near-duplicates. Concrete instrument of C6.

**When it applies.** Any corpus of tickets, reviews, messages or product descriptions, where templates and forwards generate near-exact duplicates, entering training, an index or a metric with no prior deduplication.

**Why it bites.** The same content shows up many times and everything computed over the corpus inherits it: counts are inflated, frequencies stop reflecting reality, and the model sees the same example dozens of times. The published extreme case: a single 61-word sentence repeated more than 60,000 times in C4.

> **Cross-reference.** The consequence of skipping this pass belongs to another specialty: near-identical rows must not land on opposite sides of a split, because then the test metric measures memorization. That part lives in `ML/evaluation.md`.

**Backing.** `source` — Lee et al., *Deduplicating Training Data Makes Language Models Better*, arXiv:2107.06499 — https://arxiv.org/abs/2107.06499: they document removing from C4 a single 61-word sentence repeated more than 60,000 times, and report that deduplication reduces train-test overlap, "affecting over 4 % of the validation set" of standard benchmarks.

---

## TX8. Do not trust automatic language detection; audit it

**What it requires.** If routing depends on a `detect_language()`, its accuracy is audited and its confidence is recorded as a metric. Cheap mitigation: if the text is shorter than N characters, use the contact's known language instead of the detector.

**When it applies.** Routing a message to the right model, prompt or template depends on automatic detection. One- or two-word messages ("ok", "thanks", "?") are where it fails most.

**Why it bites.** Language identification is a classifier with systematic errors, especially on short, mixed or low-resource text. A detection error routes to the wrong prompt and the user receives a response in another language, with no error in the logs. At corpus scale the damage is worse: corpora built trusting langid turned out to have large fractions of text in the wrong language.

**Backing.** `source` — Kreutzer et al., *Quality at a Glance: An Audit of Web-Crawled Multilingual Datasets*, arXiv:2103.12028 — https://arxiv.org/abs/2103.12028: they manually audit 205 corpora from five major public datasets and report that "lower-resource corpora have systematic issues: at least 15 corpora have no usable text, and a significant fraction contains less than 50 % sentences of acceptable quality. In addition, many are mislabeled or use nonstandard/ambiguous language codes". Reference tool and its declared scope: fastText, *Language identification* — https://fasttext.cc/docs/en/language-identification.html (176 languages, trained on Wikipedia, Tatoeba and SETimes).

---

## TX9. Report metrics per language, never just the average

**What it requires.** Cross-lingual evaluation is organized as a set of tasks measured language by language. Concrete instrument of C9.

**When it applies.** The dashboard has a single "intent classifier F1" cell in a multilingual product.

**Why it bites.** If 85 % of traffic is Spanish and 15 % Portuguese, that number is the Spanish one. The Portuguese regression is invisible until a client reports it, and by then it has been there for months.

**Backing.** `source` — Hu et al., *XTREME: A Massively Multilingual Multi-task Benchmark for Evaluating Cross-lingual Generalization*, arXiv:2003.11080 — https://arxiv.org/abs/2003.11080, whose very design (multi-task evaluation disaggregated by language) is the evidence for the practice.

---

## TX10. Report inter-annotator agreement with the right coefficient, not with percent agreement

**What it requires.** The quality report of a labeled dataset uses a coefficient that discounts chance agreement (Cohen's kappa, Fleiss' kappa, Krippendorff's alpha depending on the annotation design).

**When it applies.** The report says "the annotators agreed on 92 % of cases".

**Why it bites.** With a class representing 90 % of the data, that 92 % is practically noise: two annotators who always mark the majority class agree almost always without having agreed on anything informative. The dataset is accepted as good and everything trained on top inherits the problem.

**Backing.** `source` — Artstein and Poesio, *Survey Article: Inter-Coder Agreement for Computational Linguistics*, Computational Linguistics 34(4), 2008 — https://aclanthology.org/J08-4004/. The use of this family of coefficients to calibrate an LLM judge is in `LLM/evaluation.md` E5.

---

## TX11. Compute statistical power before running the experiment, not after

**What it requires.** Before labeling the evaluation set you answer: what is the minimum improvement worth detecting, and how many examples are needed to detect it. Instrument of C8.

**When it applies.** The size of the evaluation set is about to be decided. If the answer to the previous question is 2,000 examples and only 150 are labeled, the experiment cannot answer the question.

**Why it bites.** Underpowered experiments make it hard to distinguish noise from real improvement and increase the probability of exaggerated findings. The cost is not only the wasted experiment: it is that the team makes decisions with an instrument that cannot measure what it is being asked to measure.

**Backing.** `source` — Card et al., *With Little Power Comes Great Responsibility*, arXiv:2010.06595 — https://arxiv.org/abs/2010.06595: "underpowered experiments are common in the NLP literature", and for several GLUE benchmark tasks the small test sets limit what can be detected. Settled recommendation, scarce adoption.

---

## TX12. Complement the aggregate metric with behavioral tests

**What it requires.** In addition to the aggregate number, capability-directed tests: invariance (changing the customer's name must not change the intent prediction), directionality and minimum functionality. They go into CI like any unit test.

**When it applies.** The model has good F1 and still fails in production in obvious ways: negation, proper-noun change, currency change.

**Why it bites.** Measuring accuracy on held-out data overestimates real performance. The failures the user sees are categorical ("it doesn't understand when I say I do NOT want it"), not statistical, and a high average hides them perfectly.

**Backing.** `source` — Ribeiro, Wu, Guestrin and Singh, *Beyond Accuracy: Behavioral Testing of NLP models with CheckList*, arXiv:2005.04118 — https://arxiv.org/abs/2005.04118: "although measuring held-out accuracy has been the primary approach to evaluate generalization, it often overestimates the performance of NLP models"; the authors identified critical failures in both commercial and state-of-the-art models. Conceptually settled, little adopted.

---

## TX13. BLEU is for system-level machine translation diagnostics, and little else

**What it requires.** BLEU and ROUGE are not used as a general "generated text quality" metric, nor to evaluate individual texts, nor to decide between two systems by tenths of a point.

**When it applies.** Somebody proposes measuring summaries, responses or rewrites with BLEU or ROUGE and treating the number as quality. Also comparing "BLEU of 31.2 vs 31.6" and declaring a winner.

**Why it bites.** The structured review of the evidence does not support those uses. A number that looks objective becomes the deciding criterion for a product whose real quality nobody is measuring, and because it is reproducible it defends itself well in a meeting.

**Backing.** `source` — Reiter, *A Structured Review of the Validity of BLEU*, Computational Linguistics 44(3), 2018, DOI 10.1162/coli_a_00322 — https://aclanthology.org/J18-3002/: a review of 284 reported correlations across 34 papers, concluding that "the evidence supports using BLEU for diagnostic evaluation of MT systems (which is what it was originally proposed for), but does not support using BLEU outside of MT, for evaluation of individual texts, or for scientific hypothesis testing". Classic antecedent: Callison-Burch, Osborne and Koehn, EACL 2006 — https://aclanthology.org/E06-1032/.

---

## Practices marked as "changed"

These are the most valuable ones because they contradict what is still taught. Preserved intact; this is the item that belongs to text.

2. **BLEU/ROUGE are not general text quality metrics** — the evidence only supports BLEU for MT system diagnostics, not for individual texts nor for hypothesis testing (Reiter, 2018 — https://aclanthology.org/J18-3002/). See TX13.

---

## Sources that could not be opened or verified

Documented explicitly so as not to present as verified what is not. Preserved intact; this is the item that belongs to text.

3. **Volatility of `unaccent()` in PostgreSQL**: there is a widespread belief that `unaccent()` is `STABLE` and not `IMMUTABLE`, and that it therefore requires your own wrapper to be used in an expression index. **That claim was not found on the official documentation page** when searched for explicitly, so it was not included as a practice. If you need to index over `unaccent()`, verify the volatility directly in the database with `\df+ unaccent` before designing the index.

**Consultation date for this section's sources:** August 15, 2026. The PostgreSQL limits and library defaults correspond to the versions cited and must be verified against the version in use.
