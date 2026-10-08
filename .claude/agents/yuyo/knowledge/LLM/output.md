---
updated: 2026-08-16
ttl: 6 months
sources: 5
---

# Yuyo — LLM / Structured output and contracts

**What it covers.** The contract between the model and the code: schema-guaranteed structured output, validation at the boundary, the reasoning cost of constrained formats, escape values in closed sets, truncated output, retrying with the concrete error, fields nobody consumes, regex parsing of model output, reference by id, and sampling parameters.

**When to read it.** When the diff touches an output schema, a `JSON.parse` over a model response, a validator, a retry wrapper around parsing, or the sampling parameters of a call. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `B<n>`. Cross-file references name the file (`prompts.md` A1, `agents.md` C-A6, `operations.md` G7, `evaluation.md` E9).

---

## B1. Ask for structured output with a schema, not "answer in JSON"

**What it requires.** When the provider offers structured output with a schema guarantee, that is the default. If custom parsing is chosen, the reason is written down (streaming support, schema features not supported, portability across providers).

**When it applies.** A new call that asks for JSON by prompt instruction when the same provider offers structured mode. A `try/catch` with a retry around a `JSON.parse`: that is the signal that the schema is missing.

**Why it bites.** Without a native guarantee, malformed JSON is a small but constant percentage of traffic and each one costs a retry. Constrained decoding is a different and stronger mechanism than "JSON mode": the schema is compiled into a grammar and at every token the vocabulary is filtered to those that keep the output valid, whereas JSON mode only guarantees syntactically valid JSON, not conformance to your schema.

**Backing.** `source` — OpenAI, *Introducing Structured Outputs in the API* (August 6, 2024) — https://openai.com/index/introducing-structured-outputs-in-the-api/ and the guide https://platform.openai.com/docs/guides/structured-outputs. API-specific: the mechanism, the supported JSON Schema subset and the feature name vary by provider.

---

## B2. Validate at the boundary anyway: the schema guarantees shape, not truth

**What it requires.** The model's response is parsed and validated against a declarative schema at the point where it enters the system, with the same rigor as a request body, even when native structured output was used. No reaching into fields of the raw response deeper in.

**When it applies.** Code that does `JSON.parse(response)` and accesses properties without validating; access with `as` or a cast to a type with no runtime check; optional chaining (`?.`) used as a substitute for validation; a `uuid` used as a foreign key without checking existence; an enum persisted without validation; an amount that goes straight into a computation.

**Why it bites.** The TypeScript cast does not exist at runtime: a missing field becomes `undefined` that travels three layers inward and blows up far from the origin, or worse, gets persisted as `null` in a column the rest of the system assumes is populated. And the shape guarantee does not cover the failure modes that matter: the model can refuse the request, it can be cut off by the token limit leaving incomplete JSON, and it can be wrong inside the values. The shape is correct; the value may be invented (C11).

**Backing.** `source + evidence`.
- `source` — OpenAI, *Introducing Structured Outputs*, "Limitations and restrictions" section: "Structured Outputs doesn't prevent all kinds of model mistakes. For example, the model may still make mistakes within the values of the JSON object" — https://openai.com/index/introducing-structured-outputs-in-the-api/. Also, the first request with a new schema pays extra compilation latency (typically under 10 s, up to a minute on complex schemas).
- `evidence` — the case of the syntactically perfect and invented value that reaches the user: PR #9813 (BE), `url-placeholder.ts` (Panda), cited in C11.

---

## B3. The reasoning cost of constrained format is disputed: measure, do not assume

**What it requires.** Before deciding "we do not use structured output because it lowers quality", run both variants with **the same prompt** on your own eval.

**When it applies.** A PR that discards structured output citing reasoning degradation, without a run of its own.

**Why it bites.** The literature is in conflict and the most cited published comparison has a concrete methodological problem. Deciding by citation instead of by your own measurement leaves the system with fragile parsing and no proven gain, or the reverse.

**Backing.** `source + debated`.
- *Position A:* Tam et al., *Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models*, arXiv:2408.02442 — https://arxiv.org/abs/2408.02442: "we observe a significant decline in LLMs reasoning abilities under format restrictions […] stricter format constraints generally lead to greater performance degradation in reasoning tasks".
- *Position B:* Will Kurt (.txt), *Say What You Mean* — https://blog.dottxt.ai/say-what-you-mean.html: the result would be a methodological artifact (conditions were compared with different prompts; the JSON-mode prompts did not specify the schema; the parser used as a baseline performs worse than hand-written regexes; and the paper conflates JSON mode with constrained decoding). Reproducing with identical prompts, he reports that structured generation *improves* results by 1–3 percentage points. **Conflict-of-interest note:** Kurt works at the company that sells structured generation; the bias runs in the obvious direction. What survives that objection is the concrete methodological critique, which is verifiable against the original paper.
- **Recommendation:** native by default for extraction and classification, custom parsing only with a written reason, and the B2 validation stays in both cases. **Tradeoff:** if they differ on your eval, the difference is yours, not the literature's.

---

## B4. Every closed set needs its escape value declared

**What it requires.** When the output belongs to a finite set, the schema declares that set as an enum instead of free text, and the set always includes the "not applicable" or "no information" option — as an enum member or as explicit `null`. In a judge rubric it is the same rule: a conditional criterion ("if the customer gets upset, the response validates the annoyance") explicitly defines what it scores when the condition does not occur.

**When it applies.** A field typed as string whose `describe` enumerates the possible values in prose; an enum with no neutral member; a `required` non-nullable field whose prompt admits that sometimes there is no answer; a rubric criterion whose wording starts with "when", "if", "in case of", with no value reserved for "did not apply".

**Why it bites.** Without an escape value, the model is forced to pick one of the valid values even when the input contains no information to decide: it cannot abstain because the schema forbids it, so it invents the most a-priori likely one. The result is worse than a `null`, which is visible and filterable, whereas an invented classification is indistinguishable from a correct one downstream. In a rubric the damage takes another shape: where the condition does not hold, some runs give the maximum, others the minimum, others the middle, and the criterion's score ends up measuring the frequency of the condition in the sample, not the quality of the response.

**Backing.** `evidence` — "**Falta el anclaje null en un criterio condicional.** `Empatía y tono` es explícitamente condicional […] pero no tiene `null…`" — PR #13279 (BE), `src/ai-rubric/rubric-templates/vambe-phone/support.template.ts` (Panda). The case of the `required` non-nullable field against a prompt that demands `null` is in `prompts.md` A1 (PR #13096).

---

## B5. A truncated output has to be distinguishable from a complete one

**What it requires.** After every call, the stop reason is inspected. If the model was cut off by the token limit, that is a failure of the attempt: it is not persisted, not shown and not parsed as if it were complete. The same holds for your own post-processing: if a truncation discards part of the output, it is flagged.

**When it applies.** A `response.content[0].text` (or equivalent) consumed without looking at the stop reason; a `JSON.parse` over the output with no failure handling; a `split`/`find`/`slice` over the model text that keeps a fragment without verifying that it represents the whole.

**Why it bites.** A response cut off by token budget is syntactically plausible up to the cut point: a list with half the items, a sentence that ends where the user believes the idea ended. It is stored, shown and billed. Detection after the fact is nearly impossible because nothing distinguishes "the model said this" from "the model was going to say more". And since truncation happens on the longest inputs, it more often affects the most complex cases.

**Backing.** `source + evidence`.
- `evidence` — the `split(/<\/?\w[^>]*>/)` + `find(first non-empty)` that truncates silently: PR #13096 (BE), `ai-rubric-profile.schema.ts` (Panda), quoted verbatim in B8.
- `source` — OpenAI documents that the response can be cut off by `max_tokens` or another stop condition leaving incomplete JSON, and that there is an explicit refusal field — https://openai.com/index/introducing-structured-outputs-in-the-api/.

---

## B6. On malformed output, retry with the concrete error and mark the failed attempt

**What it requires.** When schema validation fails, the retry includes the validator's message and the rejected output, explicitly labeled as incorrect along with the reason. The retry has a cap and, once the cap is exhausted, the failure is recorded with the payload — never a silent discard (C12, C13).

**When it applies.** A `catch` around parsing that retries with exactly the same prompt; a `catch` that returns the default value with no log; a retry with no counter; a loop that does `messages.push(assistantResponse)` with the response that failed validation, with no subsequent message marking it as rejected.

**Why it bites.** Retrying identically is a bet on sampling variance: if the failure is systematic (the schema asks for something impossible, the prompt is ambiguous), the three retries fail the same way and you paid three times for nothing. And the model conditions on its own previous output: an unmarked invalid attempt is a format example inside the context, so the retry tends to reproduce the same error with more confidence. If on top of that the loop accumulates without pruning, the third attempt can exceed the window and fail for a completely different reason than the original, so the diagnosis points at the wrong place.

**Backing.** `source + consensus` — Hamel Husain recommends organizing assertions "for use in places beyond unit tests, such as data cleaning and automatic retries (using the assertion error to course-correct) during model inference" — https://hamel.dev/blog/posts/evals/.

---

## B7. Every schema field is paid for; if it has no consumer, remove it

**What it requires.** Every field the schema asks for has a reader in the code. Fields the model generates and nobody consumes — or that get overwritten with a computed value afterwards, or that post-processing conditionally discards — are removed.

**When it applies.** A field whose name does not appear in any file other than the schema and its type; a "reasoning" or "explanation" field that is neither persisted nor shown; a field the code immediately overwrites; a required field in a rewrite or refinement flow where the code accepts the value unconditionally even when the request was partial.

**Why it bites.** Output tokens are the expensive part of almost every pricing scheme and a required field is paid for on every call, forever. But the bigger cost is not the token: every required field is one more constraint the model must satisfy simultaneously, and the quality of the fields that do matter drops when they compete with fields nobody reads. Worse: a required field forces regeneration of content that was fine — you ask for a description fix and the schema forces rewriting all five score anchors, which are now different ones (`evaluation.md` E9). It shows up in no error: the system works, costs more, and produces lower-quality data.

**Backing.** `evidence` — "**Riesgo silencioso: un arreglo de descripción fuerza a reescribir los 5 anclajes.** `score_examples` es obligatorio en cada rewrite, y el servicio lo toma sin condición" — PR #13279 (BE), `ai-rubric-plan.schema.ts` (Panda).

---

## B8. Do not parse model output with regex if you can ask for it structured

**What it requires.** Extracting values from free text via `split`, regex or delimiter search is the last resort. If the value matters, it is asked for as a schema field. If the format has to be inserted into the text, ask the model for an explicit marker (`{{LINK}}`) that the code replaces, instead of letting the model write the value and then trying to recognize it.

**When it applies.** A `split()` over the response followed by `find` or a fixed index; a regex that extracts a value from the response; code that replaces in the output a pattern the model was supposed to produce literally.

**Why it bites.** Pattern parsing fails silently and asymmetrically: `split(/<\/?\w[^>]*>/)` plus "the first non-empty segment" truncates any value containing something that looks like a tag, and the result is still a valid string, so no validation catches it. The marker version inverts the risk: if the model does not emit the marker, the absence is detectable in an `if` and you can degrade in a controlled way; if the model had to write the whole URL, the only possible failure is a broken URL delivered to the user.

**Backing.** `evidence` — "**Bug (menor)** — `split(/<\/?\w[^>]*>/)` + `find(primer no vacío)` trunca valores legítimos en silencio: se queda solo con el **primer** segmento no vacío" — PR #13096 (BE), `ai-rubric-profile.schema.ts` (Panda); "Y si en vez de pasarle el link le pedimos que ponga {{LINK}} donde quiere que vaya? Y así no nos arriesgamos a que frikee y lo reemplazamos con regex" — PR #6507 (BE), `ai-comment-response.service.ts` (Coloro).

---

## B9. Reference by id; never ask the model to copy exact text

**What it requires.** When the output must point at something that already exists in the system — a product, a requirement, a criterion, a document, a URL — the schema asks for the identifier, not for a reproduction of the content. Resolution is done by the code, which validates that every cited identifier belongs to the set that was actually passed to the model. An invented reference is discarded or counted; never delivered literally.

**When it applies.** A field whose `describe` asks for "the exact name", "the verbatim quote" or "the link"; a `describe` that offers the alternative ("by id **or** a short quote"); code that compares the output against a list by string equality; a citation or placeholder format (`url-N`, `{{LINK}}`, `[doc-3]`) with no verification of the identifier against the available set.

**Why it bites.** Models paraphrase: one accent, one comma or one extra space and the exact comparison fails, the element is discarded or marked as not found, and the user sees an incomplete list with no visible error. Offering both options is worse than choosing wrong: the model takes the easier output (copying text) exactly in the cases where the id was not obvious to it, so the degradation concentrates on the hard cases and the id-resolution mechanism only ever gets exercised on the easy ones. And accepting free-text quotes makes downstream verification impossible: there is nothing to check a sentence against, whereas an id is compared against a set in one line.

**Backing.** `evidence` — "**El `or short quotes` habilita una respuesta que se contradice sola.** La regla 1b del prompt pide ids (*'Reference requirements by their id in covers lists'*), pero este `describe` explícitamente ofrece la alternativa" — PR #13095 (BE), `ai-rubric-plan.schema.ts` (Panda). The case of the invented reference delivered to the user is in C11 (PR #9813).

---

## B10. Temperature and determinism: declare the choice, do not inherit it

**What it requires.** Sampling parameters are chosen per task and written in the diff. For extraction, classification and structured output, the reasonable default is maximum determinism. For user-facing writing, a higher value is legitimate.

**When it applies.** A new call with no explicit sampling parameters, or with a value copied from another service whose task was different.

**Why it bites.** With high temperature on an extraction task, the same input produces different outputs across runs: bug reproducibility breaks — the report says "sometimes it returns the field wrong" and there is no way to reproduce it — and any test against the real model becomes flaky.

**Backing.** `debated`.
- *Position A:* maximum determinism by default for extraction and classification.
- *Position B:* temperature 0 does not give real determinism (batching and hardware introduce nondeterminism, and several providers document it as "mostly deterministic"), and low sampling can increase degenerate repetition and bias toward modal answers.
- **Recommendation:** maximum determinism by default for structured output, stating that it reduces variance but does not eliminate it. **Tradeoff:** you accept residual variance, far smaller than the variance introduced by a carelessly chosen temperature.

---

## What changed: widely cited practices no longer recommended the same way

Preserved intact; this is the item that belongs to structured output.

4. **"JSON mode" has been superseded by structured output with a schema.** JSON mode guarantees valid JSON but not conformance to your schema; constrained decoding against a JSON Schema does. They are different mechanisms and conflating them was one of the methodological critiques of the format-restriction paper. *Sources: OpenAI, Introducing Structured Outputs — https://openai.com/index/introducing-structured-outputs-in-the-api/; Kurt, Say What You Mean — https://blog.dottxt.ai/say-what-you-mean.html.* See B1 and B3.

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- Some sources are **interested parties** in what they recommend: .txt on structured generation (B3), and providers on their own APIs. It is flagged in each case. The numbers they publish are not replicated by independent third parties.
