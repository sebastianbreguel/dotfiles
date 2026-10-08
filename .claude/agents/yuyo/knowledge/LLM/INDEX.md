---
updated: 2026-08-16
ttl: 6 months
sources: 0
---

# Yuyo — LLM specialty index

Read `CORE.md` in full first. Then load only the leaves whose trigger is in the changed lines. Every leaf is self-contained; nothing here is a summary of the leaves.

| Leaf | Load it when the diff shows | Count |
|---|---|---|
| `prompts.md` | a prompt file, a prompt builder, a system message, a few-shot block, or a model identifier string changes | 14 (A1–A14) |
| `output.md` | a response schema, a `JSON.parse` over model output, a validator or retry-around-parsing, or a sampling parameter changes | 10 (B1–B10) |
| `agents.md` | a tool definition or handler, a tool registry, an agent loop, an agent hand-off, or a consumer that calls the model and then writes | 11 (C-A1–C-A11) |
| `retrieval.md` | a chunker, an index write path, an embedding call, a `topK`/`limit` for retrieval, or the function that assembles retrieved context | 9 (D1–D9) |
| `evaluation.md` | a grader, a rubric, an eval case file, a CI quality gate, or a score that feeds a dashboard or a decision | 12 (E1–E12) |
| `operations.md` | a guardrail, third-party text entering a prompt, a provider client / timeout / retry / queue decision, a cost computation, or call instrumentation | 34 (F1–F15, G1–G15, H1–H4) |

## Tie-breaks

- **A tool call with a schema is both `agents.md` and `output.md`.** If what changes is the *schema contract* — fields, enums, required/nullable, how the output is parsed and validated — go to `output.md`. If what changes is *what the tool can do* — when the model should pick it, which parameters it exposes, whether it mutates state, what it returns and how much — go to `agents.md`.
- **A prompt that also changes a schema** → both, and `prompts.md` A1 is the one that checks they agree. Start there.
- **Truncating text** → if it is bounding an unbounded input (tool output, transcript, history), it is core C16 and the instrument is `agents.md` C-A6 for tool returns. If it is truncating what the *judge* sees, it is `evaluation.md` E11. If it is deciding tokens versus characters, it is `operations.md` G9.
- **Prompt block ordering** → behavior is `prompts.md` A4; the prefix-cache bill is `operations.md` G1. Same change, two findings, cite both.
- **A retry** → retrying because the *schema* failed is `output.md` B6; retrying because the *provider* failed (429, overload, timeout) is `operations.md` G13 and G11; what sits inside versus outside the retry wrapper is `agents.md` C-A11.
- **Retrieval quality** → building context for the model is `retrieval.md`; the mechanics of the search engine itself (BM25, RRF, cross-encoder, trigram, `tsvector`) is `NLP/search.md`.
- **A model identifier string** → readjusting the prompt for the new generation is `prompts.md` A14; where the identifier lives and why that tier was chosen is `operations.md` G2.
- **A guardrail** → both directions of its error is core C5; a cheap prefilter in front of it is `operations.md` F1; the wording of its message back to the model is `prompts.md` A11.
- **Anything that discards, falls back or truncates silently** → core C12/C13 first, then the counter on the inference path in `operations.md` H4.

## Where the ground is known

The team reviews prompts, guards, schemas and placeholders in great detail: `prompts.md`, `output.md`, `agents.md` and the F section of `operations.md` have abundant local precedent. `retrieval.md` and `evaluation.md` have almost none, and there the backing is `source`. That changes how the finding is framed, not whether it is raised.
