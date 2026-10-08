---
updated: 2026-08-16
ttl: 6 months
sources: 8
---

# Yuyo — LLM / Prompts and instructions

**What it covers.** The text the model receives: drift between prompt, schema and code; block ordering and delimiting; context as a finite resource; few-shot examples; prompt files as artifacts; prompts grown by patches; language of the prompt versus language of the output; instruction format; chain of thought; and prompt readjustment when migrating models.

**When to read it.** When the diff touches a prompt file, a prompt builder, a system message, a set of few-shot examples, or a model identifier string. Always after `CORE.md`, which is read in full on every review. The principles here are the concrete instruments of the core: where one applies the core, it cites `C<n>`.

**Identifiers.** Entries in this file are cited as `A<n>`. Cross-file references name the file (`output.md` B4, `agents.md` C-A5, `operations.md` G1, `NLP/text.md` TX8).

---

## A1. The prompt, the schema and the code have to say the same thing

**What it requires.** The instruction the model receives, the schema that validates its output and the code that post-processes it cannot contradict each other. A rule the schema makes impossible to satisfy, or that post-processing reverts, is dead instruction paid for on every call.

**When it applies.** A diff that touches a prompt file without touching its schema, or the reverse. Concrete check: for every imperative rule in the prompt ("never invent data", "reference by id", "remove redundant examples"), look in the schema for whether the corresponding field is required or admits `null`, and in the service for whether the result is used or discarded.

**Why it bites.** It is the classic bug of LLM systems and it is doubly expensive because both halves look correct on their own. The prompt says "a field without evidence is null"; the schema declares that field `required` and not nullable. The model obeys the schema — it cannot not obey it — and invents a value: the hallucination the instruction was meant to prevent, produced by the mechanism that was supposed to prevent it. The symptom arrives as "the model hallucinates" and someone tries to fix it with more prompt, which is the wrong direction. The post-processing variant is worse: the prompt asks for a correction, the model makes it, and the code undoes it.

**Backing.** `evidence` — "el schema contradice al prompt. `ai-rubric-profile.prompt.ts` dice explícitamente *'CRITICAL RULE: never invent data; a field without evidence is null'*, pero `business_name`, […]" — PR #13096 (BE), `src/ai-rubric/schemas/ai-rubric-profile.schema.ts` (Panda); "**El prompt pide una corrección que el código descarta.**" — PR #13279 (BE), `ai-rubric-generation.service.ts` (Panda).

---

## A2. Be explicit about the desired behavior and explain the why

**What it requires.** Rules are written as verifiable behavior, not as preference, and they carry the motivation behind the instruction. Every step of a routine corresponds to a concrete action or output.

**When it applies.** A system prompt that describes a preference ("be concise", "be professional") instead of a verifiable rule. A prompt with rules and no justification, which the model then applies in the wrong case.

**Why it bites.** A preference without a criterion is interpreted differently depending on the rest of the context, and the result is inconsistency that reads as "the model sometimes ignores me". With the motivation attached, the model generalizes the rule to the cases the author did not enumerate; without it, it applies it literally where it does not belong.

**Backing.** `source` — Anthropic, *Prompting best practices*: "Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can help Claude better understand your goals and deliver more targeted responses" — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices. OpenAI says it from the other side: "Define clear actions — make sure every step in your routine corresponds to a specific action or output" (*A practical guide to building agents*, https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf).

---

## A3. Delimit and label every block; never use positional references

**What it requires.** Each type of content is wrapped in its own named delimiter (`<instructions>`, `<context>`, `<input>`, `<documents>`), with consistent names. And no block refers to another by position ("everything above", "the previous section", "the first three points"): it refers by name to named blocks.

**When it applies.** A prompt that interpolates an arbitrary-length variable with no delimiter, especially if it comes from a user or a document. A prompt string containing a positional deictic. Any marker inserted at the end of a message array that describes what came before it.

**Why it bites.** The message array is assembled dynamically and its composition changes with every feature. "Everything above is written instructions" was true when it was written; later someone inserted a dynamic context block with role `user` in between, and now the statement includes client data and declares it instructions: the model starts treating content as directive. No test catches it because the prompt still compiles and the output is still valid. Delimiting is also the prerequisite for every indirect-injection mitigation (`operations.md` F3).

**Backing.** `source + evidence`.
- `evidence` — "'Everything above' también cubre el bloque dinámico de system-context. El orden del array construido abajo es `system` → contexto dinámico (`user`) → chat history → este marcador" — PR #13072 (BE), `src/voice/ai-voice-call/services/voice-prompt-builder.service.ts` (Panda).
- `source` — Anthropic, *Prompting best practices* — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices. The XML syntax is specific to that API (other providers use Markdown or their own delimiters); the principle of delimiting is universal.

---

## A4. The order of prompt blocks is behavior, and it is also cost

**What it requires.** From most stable to most volatile: system instructions and tool definitions first, per-client context next, per-turn context last. What the model has to apply *now* — dynamic instructions recomputed per turn, conversation state, currently active restrictions — goes near the end, not buried before the history. Any reordering of blocks in a prompt builder is a behavior change and is reviewed as such.

**When it applies.** A diff that reorders, moves or inserts blocks in a prompt builder. A block rebuilt on every turn (call duration, pending tools, current time, cart state) pushed above the history. A timestamp or request id interpolated near the start of the prompt.

**Why it bites.** Two consequences. Quality: the instruction is recomputed every turn precisely because it has to influence *this* turn; if it sits fifty messages before the live message, it competes with the whole history for attention. The failure is not an error but a gradual degradation of obedience that reads as "the assistant sometimes ignores the restriction" — indistinguishable from a wording problem, so people try to fix it by rewriting the text instead of moving it. Cost: prefix caching works by exact match from the first byte, so a single character changing at the start invalidates everything after it. Putting a timestamp ahead of 8 KB of stable instructions turns a cheap cache read into a full write at full price, on every turn of every conversation, and the bill goes up without any application metric moving.

**Backing.** `source + evidence`.
- `evidence` — "esto pushea las per-turn dynamic instructions ~50 messages away from the live transcript. `callDurationInstruction` y `pendingToolIdentities` se reconstruyen en **cada** turno precisamente porque […]" — PR #13072 (BE), `voice-prompt-builder.service.ts` (Panda).
- `source` — Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*, arXiv:2307.03172 — https://arxiv.org/abs/2307.03172: "performance can degrade significantly when changing the position of relevant information, indicating that current language models do not robustly make use of information in long input contexts". The finding is from 2023 and models have changed: treat it as a hypothesis to verify with your own eval, not as law. For the cost side, see `operations.md` G1.
- **Honesty note.** The reviewer raised the point for its effect on behavior, not for cost. The prefix-cache consequence has its own backing (`source`, `operations.md` G1); it is not the reviewer's claim.

---

## A5. Treat context as a finite resource, not as available space

**What it requires.** The goal is not to fill the window but to find the smallest set of high-signal tokens. A loop that accumulates history needs a trimming policy; a tool that returns a full blob needs filtering.

**When it applies.** An agent loop that accumulates history with no compaction policy. A tool that returns an entire API JSON or an entire file instead of what was asked for. A `top_k` raised "just in case".

**Why it bites.** More context is not more capability: the relevant information competes with the filler, and the position effect makes what landed in the middle weigh less. Growth is also silent — the system works, it just costs more per turn and obeys a little less — until a long case blows past the window and fails entirely.

**Backing.** `source` — Anthropic, *Effective context engineering for AI agents* (September 29, 2025) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents: the goal is "the smallest set of high-signal tokens that maximize the likelihood of your desired outcome"; the published techniques are compaction, file-based external memory, and subagents that return a distilled summary. It is a provider's published position and it agrees with the evidence on positional degradation, but there is no settled standard on when to compact or by what criterion.

---

## A6. Few-shot examples are part of the contract, not decoration

**What it requires.** Three to five examples, relevant to the real case, diverse (covering edges and varying enough that the model does not learn an unintended pattern) and structured in tags. Their count, order and class distribution are explicit decisions.

**When it applies.** A prompt that adds or modifies examples. Examples that share an accidental trait: all short, all from the same client, all of the same output class. A set where none covers the "not applicable" or "no information" case.

**Why it bites.** The model generalizes from the examples more than it generalizes from the instructions. If all five return a list of three elements, the output will tend toward three even when the real case has one or eight. If none shows the empty case, the model avoids returning it and fills in. The bias shows up as a statistical tendency, not as a specific error, so it is the last place anyone looks.

**Backing.** `source` — Anthropic, *Prompting best practices* (recommendation of 3–5 examples, diverse, in `<example>` tags) — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices. Origin of in-context few-shot learning: Brown et al., *Language Models are Few-Shot Learners*, arXiv:2005.14165 — https://arxiv.org/abs/2005.14165.

---

## A7. Treat the prompt as an artifact with its own file

**What it requires.** Long prompts live in their prompt file, not as a template string inside the body of a method. The same holds for long constants and for the pure functions that assemble them.

**When it applies.** A service that declares a multi-line template literal with instructions inline; a long URL, list or configuration declared inside the method that uses it.

**Why it bites.** An embedded prompt is an invisible artifact: it does not diff clearly, it is not versioned separately, it cannot be reused without copying it, and its history is mixed with the service's. When somebody needs to know why the model started answering differently, the file's `git log` has sixty logic commits and one prompt commit hidden in the middle. On top of that, the embedded prompt is the one that grows by patches without anyone reading it whole (A8).

**Backing.** `evidence` — "Movería el prompt afuera de la lógica del método! Actualmente están casi todos en src/openai/prompt-templates" — PR #6507 (BE), `ai-comment-response.service.ts` (Coloro); "este prompt tambien lo dejaría en otro archivo" — PR #13352 (BE), `apply-demo-blueprint.service.ts`; "Lo definiría en algún lugar fuera de la función, como un const" — PR #1543 (BE), `get-media.service.ts`.

---

## A8. A prompt grown by patches breaks from the inside

**What it requires.** Every new rule is placed next to the rules on the same topic and contrasted with the ones already there. If it narrows or contradicts an earlier one, the earlier one is edited; rules are not stacked.

**When it applies.** A diff that appends lines to the end of a long prompt without touching the rest. Concrete flag: the prompt already contains two sections with rules on the same topic, or words like "IMPORTANT" / "CRITICAL" / "ALWAYS" in more than three places.

**Why it bites.** Contradictory instructions do not produce an error: they produce behavior that depends on the case, and the model resolves the conflict differently depending on the rest of the context. It shows up as intermittent inconsistency, and every attempt to fix it adds another emphatic rule that deepens the conflict. The prompt ends up as sediment where nobody knows which line is still needed, and removing any of them is scary. On top of that comes the position effect: the new rules end up buried in the middle of the context exactly when the prompt has grown.

**Backing.** `source + consensus` — the burial mechanism is in Liu et al., arXiv:2307.03172 — https://arxiv.org/abs/2307.03172. The discipline of editing instead of stacking is `consensus`.

---

## A9. Decide the language of the prompt and the language of the output separately

**What it requires.** The language the prompt is written in and the language the model must answer in are two independent decisions and both are explicit. Writing instructions in English and passing the output language as a parameter usually works better than translating the whole prompt.

**When it applies.** A new system prompt written in the client's language; a prompt with no instruction at all about the response language; a prompt where the language of the instructions changes halfway through the text.

**Why it bites.** With no explicit instruction, the model infers the output language from the prompt or from the last message, and that inference breaks with mixed input: a client writes one word in English and the entire response switches language. Also, a translated prompt drifts from its original on every iteration: one version gets tuned and the others fall behind.

**Backing.** `evidence` — "quizás mejor en inglés y decirle el idioma de output" — PR #12523 (BE), `ai-rubric-generation.service.ts`. Related on the routing side: automatic language detection is not reliable on short texts (`NLP/text.md` TX8).

---

## A10. Do not inaugurate an instruction format without evidence

**What it requires.** Instructions are emitted in the format the system already uses and has validated. Changing it (JSON to Markdown, prose to lists, XML to plain text) is a behavior change that needs justification, not an aesthetic preference.

**When it applies.** An instruction generator that emits in a structure different from the rest of the system; a new prompt that introduces delimiters or conventions no other prompt in the repository uses.

**Why it bites.** Format affects model obedience in a measurable and unintuitive way: two formats with the same semantic content do not perform the same. Introducing a third one fragments what is known — any previous measurement stops applying to this path and comparison across assistants stops being valid.

**Backing.** `evidence` — "Entiendo que performea mejor cuando las instructions las tenemos en markdown, preguntale a Panda igual que el implemento la migracion de instrucciones en json a markdown" — PR #4967 (BE), `src/assistant-v2/prompt-block/utils/generate-instructions.ts`.

---

## A11. Do not name what you do not want to see, neither in the prompt nor in the error message

**What it requires.** Rules are written as what the model *must* do. When a prohibition is unavoidable, it does not describe the forbidden artifact in detail and does not mention the concrete format that caused it. The same holds for the text returned by a guardrail or a failed validation, whether it is shown to the user or re-injected into the model.

**When it applies.** A prompt or guardrail message with "do not mention X", "never say Y", "do not answer in format Z", where X, Y or Z are described specifically. A new error message on a guardrail or retry path that mentions an internal format (JSON, reasoning tags, prompt block names), a system capability, or the concrete name of the rule that fired.

**Why it bites.** Naming the artifact introduces it into the context and raises its probability of appearing: the model conditions on everything it reads, including the prohibition. A message that says "do not answer with JSON" is a live demonstration of the concept right before the model generates, so the message meant to correct actually raises the probability of repeating the failure and the retry becomes an expensive loop. The effect is counterintuitive and that is why it survives reviews: the text reads as safer and produces the opposite. Toward the user the damage is different: it describes the internal architecture and teaches whoever is probing the system where to push.

**Backing.** `evidence` — "este mensaje hace demasiada referencia al mensaje con json pero podría ser cualquier guardrail. mencionar el error puede hacer que lo haga más también" — PR #12392 (BE), `send-ai-message-node.service.ts` (Max); "Soy más partidario de que si no hay placeholders ni siquiera se los mencionemos a la IA […] también le sacaría la mención de que las url placeholder hacen referencia a" — PR #12399 (BE), `get-gather-information-prompt.ts`.

---

## A12. Write the prompt for the model, not for the reader

**What it requires.** Tool descriptions and prompts are written to optimize the model's decision: what it needs to know to choose well and complete well. Product context, commercial narrative and internal details that do not change its decision are removed.

**When it applies.** A prompt file or function description that narrates the product ("X is a platform that…"), explains internal architecture, or describes routes and formats the model cannot use.

**Why it bites.** Irrelevant text is not neutral: it competes for attention with the instructions that matter and, when it describes internals, it gives the model material to invent with. A prompt that mentions an internal URL format produces invented URLs in that format, plausible and broken. The "explanatory" version looks better in code review — it looks like documentation — and performs worse.

**Backing.** `source + evidence`.
- `evidence` — "Cacha que esta descripción está escrita como para que un humano entienda que hace. La volvería a escribir pensando en qué un agente de IA la tiene que decidir usar. Me refiero a ni siquiera mencionar the Vambe Marketplac[e]" — PR #6591 (BE), `get-marketplace-products-properties.ts`.
- `source` — Anthropic, *Writing effective tools for agents — with agents* — https://www.anthropic.com/engineering/writing-tools-for-agents.

---

## A13. Use chain of thought where it pays off, not by default

**What it requires.** "Reason step by step" is not pasted into every prompt. It is decided with the eval, and in classification or extraction tasks where the reasoning is discarded, it is removed.

**When it applies.** A classification or extraction prompt that includes "reason step by step" and whose output is discarded except for the final verdict.

**Why it bites.** You pay latency and output tokens — the expensive part of almost every pricing scheme — with no measurable gain on non-symbolic tasks.

**Backing.** `source + debated`.
- *Position A (the paper):* Sprague et al., *To CoT or not to CoT?*, arXiv:2409.12183 — https://arxiv.org/abs/2409.12183: meta-analysis of more than 100 papers plus evaluations over 20 datasets and 14 models; CoT gives strong benefits mainly in math and logic, and on MMLU answering directly performs almost as well. CoT via prompting is over-applied.
- *Position B (providers):* current reasoning models incorporate native, budget-controllable extended reasoning, and the recommendation is to leave it on with general instructions ("think deeply") rather than prescriptive steps — Anthropic documents `budget_tokens` with a minimum of 1,024 and adaptive modes, https://docs.claude.com/en/docs/build-with-claude/extended-thinking.
- **Recommendation:** do not add manual CoT by reflex; use native reasoning where it exists and decide with the eval. **Tradeoff:** native reasoning costs tokens that are not visible in the prompt, so it has to be measured on the bill, not in the diff.

---

## A14. Migrating models requires readjusting the prompt, and floating aliases are avoided

**What it requires.** Changing the model identifier triggers the same before/after as changing the prompt (C3), plus a review of the text: prompts are not portable across generations. Undated aliases (`…-latest`) do not go to production.

**When it applies.** The diff changes a model string, introduces an undated alias, or adds a new call with the model written inline. Specific signal: the prompt contains aggressive language added at the time to force tool use or exhaustiveness.

**Why it bites.** Newer models are more sensitive to the system prompt: prompts written to correct tool undertriggering now cause overtriggering, and anti-laziness language produces the opposite problem. With a floating alias the change happens with no diff at all: one Tuesday the system behaves differently and there is no commit to blame. With the identifier repeated across ten files, half the system migrates and the other half does not, and the two halves produce outputs incompatible with each other.

**Backing.** `source + evidence`.
- `source` — Anthropic, *Prompting best practices*, "Migration considerations" section: "If your prompts were designed to reduce undertriggering on tools or skills, these models may now overtrigger. The fix is to dial back any aggressive language" — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices.
- `evidence` — unfounded model choice was objected to in PR #7510 and PR #11237 (Max), cited in `operations.md` G2.

---

## What changed: widely cited practices no longer recommended the same way

The most perishable and most useful section. Each item is a practice that circulates widely in tutorials and that current primary sources qualify or advise against. Preserved intact; these are the items that belong to prompts.

1. **Prefilling the assistant response is no longer supported.** Putting the first words of the response in the assistant turn to force a format (typically a `{` to force JSON) used to be a standard technique. The current doc says: "Prefilled responses on the last assistant turn are no longer supported starting with Claude 4.6 models and Claude Mythos Preview", and points to alternatives. *Source: Anthropic, Prompting best practices, Migration considerations section — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices. Specific to the Anthropic API.*
2. **Manual "think step by step" is being replaced by native reasoning.** The current doc presents manual CoT as a *fallback* for when thinking is off, and recommends preferring general instructions ("think deeply") over hand-written prescriptive plans, because "Claude's reasoning frequently exceeds what a human would prescribe". In several recent models thinking is on by default. *Source: Anthropic, Prompting best practices and Extended thinking — https://docs.claude.com/en/docs/build-with-claude/extended-thinking. Specific to the Anthropic API; the general pattern of budget-controllable reasoning also exists at other providers.* See A13.
3. **"Anti-laziness" prompting now produces the opposite problem.** The aggressive phrases added so the model would use tools or be more exhaustive now cause overtriggering, and the doc explicitly recommends toning them down. It also warns about over-engineering: newer models "have a tendency to overengineer by creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested". *Source: Anthropic, Prompting best practices — https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices.* See A14.

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- The *Lost in the Middle* finding (A4, and `retrieval.md` D4) is from 2023 and models have changed a lot since: treat it as a hypothesis to verify with your own eval, not as law. The practical corollary (retrieve less and better instead of more) does remain valid and appears in 2024–2025 sources.
