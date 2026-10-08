---
updated: 2026-08-16
ttl: 24 months
sources: 9
---

# Yuyo — NLP / Tokenization and segmentation

**What it covers.** How text is cut into units: word segmentation across scripts, subword units and open vocabulary, reversible language-independent tokenization, tokenizer fertility per language (the effective length of a text), sentence segmentation, and Chinese word segmentation.

**When to read it.** When the diff touches a tokenizer, a `split()` over text, a feature pipeline that counts words, a token estimation, a chunker that splits by sentences, or any character-based length limit derived from a model's context window. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `TK<n>`. Cross-file references name the file (`NLP/text.md` TX3, `LLM/operations.md` G9).

**Note on the distribution of backings in this specialty.** Almost everything here is `source` and almost nothing is `evidence`: there is no local record of anyone asking for anything about tokenization. That does not weaken the principles — they have a paper or official documentation behind them — but you explain the mechanism and cite the source rather than invoking precedent that does not exist.

---

## TK1. Do not tokenize on whitespace in a pipeline that will see more than one language

**What it requires.** Word segmentation uses a library that implements the standard's rules, not `split()` or `\w+`, as soon as the product has users outside the Latin alphabet.

**When it applies.** A `text.split()` or a `\w+` in the feature pipeline. Also the counting of "words" in product metrics.

**Why it bites.** Reliable word boundary detection in languages without spaces is not solved with space rules. The pipeline does not fail: it produces empty or nonsensical features for those languages, and the global metric — dominated by the majority language — does not move.

**Backing.** `source` — UAX #29, *Unicode Text Segmentation* — https://unicode.org/reports/tr29/: "reliable detection of word boundaries in languages such as Thai, Lao, Chinese, or Japanese requires the use of dictionary lookup or other mechanisms"; and "for scripts that use the Southeast Asian contextual analysis style, neither the default word boundaries nor the default line breaks are adequate; both need tailoring".

---

## TK2. Use subword units so you do not have a closed vocabulary

**What it requires.** Segmentation into subword units instead of a word vocabulary with an `UNK` token for everything unknown.

**When it applies.** The `UNK` rate over production data exceeds an uncomfortable percentage, or the vocabulary grows without a ceiling because users write product names, SKUs and typos.

**Why it bites.** Everything not seen in training collapses into the same token, so the model loses exactly the information that distinguishes one product from another. And an open vocabulary makes the model size depend on the most creative client.

**Backing.** `source` — Sennrich, Haddow and Birch, *Neural Machine Translation of Rare Words with Subword Units*, arXiv:1508.07909 — https://arxiv.org/abs/1508.07909 (BPE applied to NLP). Reference implementation: Hugging Face `tokenizers` — https://huggingface.co/docs/tokenizers/en/index.

---

## TK3. Use SentencePiece when you need reversibility and language independence

**What it requires.** When the pipeline has to reconstruct the original text from the tokens, or when the corpus mixes languages with and without spaces, use a tokenizer that trains on raw text and detokenizes losslessly.

**When it applies.** The pipeline needs to map predictions back to offsets in the original text (NER, highlighting the match in the UI), or the corpus mixes Japanese or Chinese with space-separated languages.

**Why it bites.** With language-dependent pre-tokenization, detokenization is approximate: offsets shift and the UI highlight marks the wrong fragment, with the aggravating factor that it looks like a frontend bug.

**Backing.** `source` — Kudo and Richardson, *SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing*, arXiv:1808.06226 — https://arxiv.org/abs/1808.06226.

---

## TK4. Measure tokenizer fertility per language before estimating cost or length

**What it requires.** Any token estimate or "how much text fits" estimate is measured per language, tokenizing the same paragraph translated into each supported language and comparing the lengths. A single factor is not used.

**When it applies.** A `chars / 4` style constant to estimate tokens. A cost projection made with an English sample when the product operates in Spanish, Portuguese or Arabic. A character limit whose comment mentions a model's context limit.

**Why it bites.** The same information costs very different amounts of tokens depending on the language, because the tokenizer was trained on a specific distribution. A budget calibrated in English goes over the real limit when Spanish with emoji or a JSON payload comes in, and the failure is a hard provider error mid-production, at the worst moment: when the conversation is already long. On the cost side, the projection comes up short precisely for the clients of the most expensive languages.

**Backing.** `source` — Ahia et al., *Do All Languages Cost the Same? Tokenization in the Era of Commercial Language Models*, arXiv:2305.13707 — https://arxiv.org/abs/2305.13707. Complemented by: Petrov et al., *Language Model Tokenizers Introduce Unfairness Between Languages*, arXiv:2305.15425 — https://arxiv.org/abs/2305.15425. The use of this measurement to budget prompts is in `LLM/operations.md` G9.

---

## TK5. Sentence segmentation is not splitting on the period

**What it requires.** Sentence segmentation uses a specific library, not a `split('.')`.

**When it applies.** A `text.split('.')` to chunk, count sentences or align with a transcript. Notebook check: look at the 20 shortest "sentences" in the corpus; if they are full of fragments like `Mr`, `2` or `com`, segmentation is broken.

**Why it bites.** Abbreviations, decimals, acronyms, URLs, quotes and lists break the period rule. The resulting fragments propagate: chunks split in half, inflated counts, shifted alignments. None of that throws an error.

**Backing.** `source` — Sadvilkar and Neumann, *PySBD: Pragmatic Sentence Boundary Disambiguation*, arXiv:2010.09657 — https://arxiv.org/abs/2010.09657. Documented alternative: spaCy, *Linguistic Features* — https://spacy.io/usage/linguistic-features (tokenization and sentence segmentation, including the rule-based `sentencizer` versus dependency-based segmentation).

---

## TK6. For Chinese, word segmentation is no longer a mandatory step

**What it requires.** Adding a Chinese word segmenter to a neural pipeline is justified by task, not by custom.

**When it applies.** Somebody is about to add `jieba` or another segmenter as a mandatory dependency of a neural pipeline.

**Why it bites.** It is one more component that can fail, and on several tasks character-based models outperform word-based ones, largely due to data sparsity and OOV.

**Backing.** `source + debated` — Li et al., *Is Word Segmentation Necessary for Deep Learning of Chinese Representations?*, ACL 2019, pp. 3242–3252 — https://aclanthology.org/P19-1314/.
- *Position A:* for deep learning, char-level avoids OOV and sparsity, and the segmenter only adds a component that can fail.
- *Position B:* segmentation is still useful for symbolic tasks (lexical search, indexing, linguistic analysis) and for non-neural models, where the "word" unit has interpretive value.
- **Recommendation:** no segmenter on the neural path; segmenter on the lexical path. **Tradeoff:** two representations of the same text that have to be kept in sync.
- Practice that **changed**: it used to be doctrine, now it has to be justified.

---

## Practices marked as "changed"

These are the most valuable ones because they contradict what is still taught. Preserved intact; this is the item that belongs to tokenization.

3. **Chinese word segmentation is no longer mandatory** in neural pipelines; character-based models outperform it on several tasks (Li et al., 2019 — https://aclanthology.org/P19-1314/). See TK6.

---

**Consultation date for this file's sources:** August 15, 2026. Library defaults correspond to the versions cited and must be verified against the version in use.
