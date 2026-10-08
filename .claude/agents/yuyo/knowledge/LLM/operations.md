---
updated: 2026-08-16
ttl: 6 months
sources: 20
---

# Yuyo — LLM / Operations: guards, injection, cost, latency and observability

**What it covers.** Everything that happens around the call rather than inside it: deterministic prefilters, prompt injection and its containment, least privilege, output sanitization, model-path guards, control-token collisions, secrets and personal data in logs, per-user consumption limits; prefix caching, model selection, batching, latency, concurrency, timeouts, retries, queues, error classes, pricing; and the observability of every call — traces, tokens and cost per operation, traceability from a complaint, and counters for degradation.

**When to read it.** When the diff touches a guardrail, any path where third-party text enters a prompt, a tool that reaches out to an external system, a provider client construction, a retry or timeout policy, a cost computation, or the instrumentation around a model call. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `F<n>` (guards, injection and model security), `G<n>` (cost and latency) and `H<n>` (call observability), kept from the original numbering so existing cross-references stay valid. Cross-file references name the file (`prompts.md` A4, `output.md` B5, `agents.md` C-A5, `retrieval.md` D5, `evaluation.md` E12).

**Provider-agnostic.** API names appear only as examples. Where each provider calls the same concept something different (stop reason, prefix cache, overload error), the generic term is used. Concrete numbers for prices, TTLs and cacheable minimums are specific to each API, change frequently, and are annotated with a consultation date (August 15, 2026): verify them before using them in a calculation.

---

## F. Guards, injection and model security

### F1. A deterministic prefilter may only escalate to the model, never decide the happy case

**What it requires.** A cheap prefilter in front of an LLM evaluation may *escalate* to the model but may not issue the permissive verdict on its own. The short-circuit default is the expensive path. If it is nonetheless decided that it should cut, you need: the concrete cases it misclassifies today, a counter of how often it short-circuits, a written reason why the saving is worth it, and a periodic measurement running the judge over a sample of what it let through.

**When it applies.** An `if (!matchesAnyTerm(text)) return { safe: true }` before a call to a judge or guard; any early return with the non-blocking result that skips the model call, decided by regex, token comparison or numeric threshold.

**Why it bites.** All heuristics have false negatives; the difference is whether they are recoverable. If the prefilter escalates, a miss costs one extra call; if it approves directly, a miss is a case that was **never evaluated** and went out to the user. It also inverts the asymmetry of the error: when the model gets it wrong there is a record of the call and it can be audited; when the prefilter gets it wrong there is no call, no trace and nothing to review. And it contaminates measurement: the judge's metric is computed only over what the prefilter let in, so it looks perfect precisely because the prefilter already removed the hard cases — it improves the worse the prefilter works.

**Backing.** `evidence` — "el pre-filtro devuelve un `safe` definitivo sin pasar por el LLM cuando ningún término 'matchea', así que sus misses son silenciosos e irrecuperables: - El matching numérico exige grupos de **≥3 dígitos**" — PR #13101 (BE), `src/ai/guardrail/output/custom-judge/services/custom-judge-evaluation.service.ts` (Panda). It is the most precise formulation in the corpus of this failure mode. The analysis of both directions of the error is in C5.

---

### F2. Treat prompt injection as unpreventable and design to contain it

**What it requires.** The design assumes injection eventually gets through and limits the damage. There is no "fix prompt injection" ticket that gets closed by adding a sentence to the system prompt.

**When it applies.** A security argument that rests on a prompt instruction. A new feature that puts external text into a prompt and whose only defense is a classifier or an input filter.

**Why it bites.** The model does not reliably distinguish between your instructions and the text you pass it. A heuristic filter raises the cost of the attack from trivial to non-trivial, but an attacker with enough attempts gets past it, and the damage depends on what the model can do: leaking the system prompt is embarrassing; triggering a tool that writes is an incident.

**Backing.** `source` — OWASP Gen AI Security Project, *LLM01:2025 Prompt Injection* — https://genai.owasp.org/llmrisk/llm01-prompt-injection/: "Given the stochastic influence at the heart of the way models work, it is unclear if there are fool-proof methods of prevention for prompt injection", and RAG and fine-tuning "do not fully mitigate prompt injection vulnerabilities". It is LLM01, the number one risk, for the second consecutive edition.

---

### F3. Third-party text entering the prompt is data, not instruction

**What it requires.** All content your team did not write — end-user message, email, product description from an external catalog, web search result, uploaded document content — enters delimited and labeled as untrusted (`prompts.md` A3), and the instructions governing behavior do not depend on that content respecting them.

**When it applies.** A new interpolation whose value comes from a table written by a client or third party, from a webhook, from an email body or from an external API, glued to the instruction text with no delimiter. Any tool that brings in content a third party can write: `fetch_url`, reading emails, tickets, comments, uploaded files, search results.

**Why it bites.** **Indirect** injection allows remote attacks with no direct interface to the system: your system's user can be entirely honest and the attack still works. Processing retrieved prompts can act as arbitrary code execution, manipulate the application's functionality and control how and whether other APIs are called. Detection is hard because the attempt looks like just another message and only stands out if somebody reviews the traces.

**Backing.** `source` — Greshake et al., *Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection*, arXiv:2302.12173 — https://arxiv.org/abs/2302.12173, the foundational work in the area: "processing retrieved prompts can act as arbitrary code execution, manipulate the application's functionality, and control how and if other APIs are called". It matches OWASP LLM01 mitigation 6 (segregate and identify external content).

---

### F4. Apply the seven OWASP mitigations as layers, not as alternatives

**What it requires.** Use the full list as a review checklist for any feature that puts external text into a prompt: (1) constrain model behavior by defining role, capabilities and limits in the system prompt; (2) define and validate expected output formats, with deterministic code verifying conformance; (3) input and output filtering; (4) privilege control and least-privilege access, with separate API tokens; (5) human approval for high-risk actions; (6) segregate and identify external content; (7) periodic adversarial testing, treating the model as an untrusted user.

**When it applies.** A new feature with external content that implements only one of the seven and declares itself covered.

**Why it bites.** (1) and (3) are the weakest — they are heuristics an attacker can get around — while (4) and (5) are the ones that actually bound the damage. A design that implements only the weak ones has the appearance of defense and no containment.

**Backing.** `source` — OWASP, *LLM01:2025 Prompt Injection*, "Prevention and Mitigation Strategies" section — https://genai.owasp.org/llmrisk/llm01-prompt-injection/.

---

### F5. Avoid the lethal trifecta in a single agent context

**What it requires.** An agent must not combine all three: access to private data, exposure to untrusted content, and the ability to communicate outward. If all three are yes, one has to be broken.

**When it applies.** Reviewing an agent's tool list. It is a three-question test done in a PR review.

**Why it bites.** With all three capabilities, an attacker can trick the agent into accessing private data and sending it out. The exfiltration channel is nearly impossible to close by enumeration: any tool that can make an HTTP request — or even generate a link for the user to click — works for getting data out.

**Backing.** `source` — Simon Willison, *The lethal trifecta for AI agents: private data, untrusted content, and external communication* (June 16, 2025) — https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/, with the concrete case of the GitHub MCP exploit, where a single server combined all three properties. The term comes from this source; the underlying phenomenon is consensus and appears in OWASP LLM01/LLM06.

---

### F6. Least privilege in tools, enforced in the destination system

**What it requires.** Avoid open-ended extensions and limit permissions to the minimum, enforcing them in the database or in IAM, not in the tool description or in the prompt.

**When it applies.** A tool that exposes an `execute_query(sql)` or a `run_command(cmd)`. An agent that connects with the same credentials as the application.

**Why it bites.** *Excessive Agency* enables damaging actions in response to unexpected, ambiguous or manipulated outputs, regardless of what caused them; its three roots are excessive functionality, excessive permissions and excessive autonomy. If the agent needs to write a file, giving it "run a shell command" opens the scope to any command. And a permission written in the prompt is not a permission: it is a suggestion.

**Backing.** `source + evidence`.
- `source` — OWASP, *LLM06:2025 Excessive Agency* — https://genai.owasp.org/llmrisk/llm062025-excessive-agency/. The verbatim example: an agent that recommends products only needs read access on the `products` table, and that is enforced with database permissions on the identity the extension connects with.
- `evidence` — PR #4939 (BE) (Panda), cited in `agents.md` C-A4: the connection parameter is resolved from the token, not from the input.

---

### F7. Do not delegate security to the model's instruction hierarchy

**What it requires.** The trained instruction hierarchy is used as a layer, not as a control. Containment lives in permissions and architecture.

**When it applies.** A design's security argument is "it is in the system prompt, the model will respect it".

**Why it bites.** It is an improvement in statistical robustness, not a guarantee: it is still the same channel for instructions and data, and an attacker with enough attempts gets past it.

**Backing.** `source + debated` — Wallace et al. (OpenAI), *The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions*, arXiv:2404.13208 — https://arxiv.org/abs/2404.13208: applied to GPT-3.5, the method markedly improved robustness against several attack types, including ones not seen in training, without degrading standard tasks.
- *Position A:* with a trained hierarchy, putting the rules in the system prompt is a real, measurable defense. *Position B (OWASP, Willison, CaMeL):* any model-level defense is probabilistic.
- **Recommendation:** the two positions are compatible in practice — use it as a layer, never as the control. **Tradeoff:** none real; the mistake is treating it as sufficient.

---

### F8. Prefer design patterns with guarantees over heuristic filters

**What it requires.** When the agent handles sensitive data and external content at the same time, the right direction is not detecting injections but restricting by construction what untrusted data can influence.

**When it applies.** An agent with sensitive data and external content whose only defense is "add a jailbreak classifier".

**Why it bites.** Security by design costs utility, and the cost is quantifiable and moderate: CaMeL solves 77 % of AgentDojo tasks *with provable security guarantees*, versus 84 % with no defenses. The heuristic filter, by contrast, has no known upper bound on what it lets through.

**Backing.** `source` — Debenedetti et al. (Google DeepMind, ETH Zürich), *Defeating Prompt Injections by Design*, arXiv:2503.18813 — https://arxiv.org/abs/2503.18813, which extracts the control flow and data flow from the trusted query so that untrusted data never affects the program flow, and uses capabilities to prevent exfiltration. Complementary: Beurer-Kellner et al., *Design Patterns for Securing LLM Agents against Prompt Injections*, arXiv:2506.08837 — https://arxiv.org/abs/2506.08837. Conceptual antecedent: Simon Willison, *The Dual LLM pattern* (April 25, 2023) — https://simonwillison.net/2023/Apr/25/dual-llm-pattern/: a privileged LLM with tools that never sees untrusted content, and a quarantined one with no tools that processes it, with the hard rule that the second one's output never goes back to the first without structural validation. It is the most promising line of research, but implementing it means rewriting the agent's architecture, not adding a layer. Willison's actionable warning: any output from the component that touched untrusted content — including chained outputs — must be treated as radioactive.

---

### F9. Validate and sanitize the model's output before it touches another system

**What it requires.** The ids, amounts, dates and enums the model passes to a tool are validated against the source of truth: existence, membership in the client or ongoing conversation, range and format. And the generated text is sanitized according to its destination: escaped for HTML, parameterized for a query, never interpolated raw into a command or a template.

**When it applies.** A handler that uses an argument directly in a `where`, in an external API URL or in a write with no prior verification query — concrete flag: `args.someId` in a query with no preceding line validating it against the client's scope. Also: model output interpolated into markup, into a query built by concatenation, into a file path, into a redirect URL, or into a shell.

**Why it bites.** *Improper Output Handling* is the vector by which a prompt injection turns into XSS, SQL injection or remote execution: the LLM is not the final target, it is the intermediary. And the model produces exactly what the attacker dictated through third-party content, with the difference that the input already passed your validations at the start and nobody looks at it again at the end. Mental rule: LLM output is user input for everything downstream.

**Backing.** `source + evidence`.
- `source` — OWASP, *LLM05:2025 Improper Output Handling*, within the Top 10 2025 — https://genai.owasp.org/llm-top-10/. The complete list: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption.
- `evidence` — "El regex `[^\s"'<>)\]]+` no corta en `.`, `,`, `?`, `!`" — PR #9813 (BE), `url-placeholder.ts` (Panda), where punctuation sanitization determines what gets delivered to the user. Per-client membership verification is in C11.

---

### F10. No fallback branch may skip sanitization

**What it requires.** If there is a default branch — the final `else`, the "should never get here", the `switch` `default` — it applies the same sanitization, the same escaping and the same limits as the normal branches.

**When it applies.** A `switch` or `if` chain over the type or shape of a content block where only some branches sanitize; or a final branch that emits the raw value, commented as an impossible case.

**Why it bites.** The impossible branch gets reached as soon as a type changes shape — for example, a field that went from string to array of strings — and that change usually comes from another diff, another author, another month. From that moment on, content goes out unsanitized through a path no test covers because it was declared unreachable. It is the favorite escape route for prompt injection and for injection into the final render, and it leaves no trace in the logs because it is not an error.

**Backing.** `evidence` — "Rendering lands in the 'should never get here' fallback and skips sanitization. `content` is a `string[]`, so `formatBlock` misses the `typeof content === 'string'` branch, has no `temporal_information` case, and fal[ls]" — PR #13827 (BE), `src/assistant-v2/prompt-block/utils/render-temporal-blocks.ts` (Panda).

---

### F11. Verify that the guard protecting the model path can actually fire

**What it requires.** Before accepting a defensive condition, read what the function being checked actually returns. A guard against a value the layer below never produces is dead code that gives false reassurance.

**When it applies.** An `if (!x)`, `if (x?.length)` or `catch` around an internal call whose contract the diff does not show; especially if the function below throws instead of returning an empty value.

**Why it bites.** The review passes because there is a guard and the guard looks reasonable. At runtime the function throws instead of returning falsy, so the defensive path never runs and the exception propagates to a place that does not expect it — typically the generic `catch` further up, which turns it into the empty result of C12. You pay twice: the dead guard hides that the real protection is missing.

**Backing.** `evidence` — "esta guarda está muerta: `UserService.getCompanyInfo` o lanza `NotFoundException` o devuelve un object literal, nunca un valor falsy" — PR #13096 (BE), `src/ai-rubric/services/ai-rubric-profile.service.ts` (Panda).

---

### F12. User text must not collide with your control tokens

**What it requires.** If the system uses markers, tags or short identifiers inside the prompt (`url-1`, `<doc>`, `{{LINK}}`), user text entering the same prompt is neutralized, or the namespace is impossible to write by accident. The decoder replaces only the markers the system emitted in that same execution.

**When it applies.** A new marker scheme whose pattern is ordinary plain text, applied to a prompt that also includes incoming user messages; or a decoder that replaces by pattern without verifying the marker's origin.

**Why it bites.** A client who writes the sequence in their message — sometimes unintentionally, sometimes probing — makes the decoder replace text the system never encoded, or conversely, leaves the user's message transformed into something they did not say. In the best case the user sees internal text; in the worst, they control where a link points that the system presents as its own, which is phishing served from your brand. There is no error, no log, and it is only discovered if somebody reads the final message carefully.

**Backing.** `evidence` — "**Colisión entre `url-N` literal del usuario y placeholders del run.** Si un cliente manda un mensaje inbound con texto del tipo 'oye, te paso el url-1 que necesitas' (sin ningún URL de S3), el encode no registra nada" — PR #9813 (BE), `src/ai-message/utils/url-placeholder.ts` (Panda).

---

### F13. Neither credentials nor personal data in AI logs

**What it requires.** The authorization header, the provider key and integration tokens are never serialized into a log, not even inside an error or configuration object. Conversation content, which almost always carries personal data, goes to the trace store with its own retention and access control, not to the general log.

**When it applies.** A `logger.error(error)` over an HTTP client error (which usually drags along the request configuration with its headers); a `JSON.stringify` of a configuration object or an integration token; the full body of a prompt written to the standard logger.

**Why it bites.** A secret that entered a log is compromised forever, and logs are replicated to destinations with far broader permissions than the code's: aggregators, alerts, screenshots in chat channels. Rotation is the only remedy and it only works if somebody noticed. With personal data the problem is different but equally expensive: the general log usually does not have the bounded retention of the trace store, so customer conversation content stays archived longer than policy allows, and that shows up in an audit.

**Backing.** `source + consensus` — OWASP, *LLM02:2025 Sensitive Information Disclosure*, within the Top 10 2025 — https://genai.owasp.org/llm-top-10/. The prohibition on hardcoding or logging secrets is also explicit policy in this repository.

---

### F14. Minimize what travels to the provider and write down what is sent

**What it requires.** What enters the prompt is the subset of fields the task needs, not the whole row. Document numbers, payment methods, credentials and health data are not sent unless the task is impossible without them, and in that case the decision is documented along with what the provider's retention policy allows.

**When it applies.** A `SELECT *`, a `JSON.stringify(entity)` or a full domain object interpolated into a prompt; a new field added to the context that belongs to a sensitive category.

**Why it bites.** Sending too much is at once cost (tokens for fields nobody reads), quality (noise that worsens the answer) and exposure: the data ends up in a third party's system under their retention policy, not yours, and later shows up in traces and debug storage. The commitment your customer's contract made about where their data lives is broken by one line nobody connected to it, and it is discovered in an audit or in a large customer's security questionnaire.

**Backing.** `source + consensus` — OWASP LLM02 — https://genai.owasp.org/llm-top-10/. The sibling reflex from the quality angle has local precedent in `retrieval.md` D5 (PR #12360).

---

### F15. Per-user consumption has to be bounded on the server side

**What it requires.** There is a cap per client and per unit of time on the model calls a user can trigger, enforced on your server and not delegated to the provider's rate limit. When exceeded there is a defined response, not a generic error.

**When it applies.** A new endpoint whose handler calls the model and is exposed to external traffic — webhook, messaging channel, public endpoint — with no limit of its own; or a feature that allows triggering bulk generation from the UI with no cap.

**Why it bites.** The marginal cost per request is high and the attacker pays it on your bill: it is economic denial of service, and it does not require malice — a client with a badly written integration loop is enough. Without your own cap, containment is exercised by the provider's rate limit, which is global to your account, so one client's abuse takes the service down for everyone else. Detection arrives as a general product outage and the diagnosis points everywhere except at the account that caused it, unless there is already per-client cost labeling (H2).

**Backing.** `source + consensus` — OWASP, *LLM10:2025 Unbounded Consumption* — https://genai.owasp.org/llm-top-10/.

---

## G. Cost and latency

### G1. Use prefix caching and order the prompt from stable to variable

**What it requires.** The stable part (system prompt, tool definitions, reference documents) goes first; the variable part at the end (`prompts.md` A4). If the prefix exceeds the cacheable minimum and repeats across requests, it is marked for caching.

**When it applies.** A long system prompt repeated across requests with no caching. Concrete anti-pattern: interpolating a timestamp or request id near the start, which invalidates the entire prefix.

**Why it bites.** Caching is priced differently: writes cost above the base input price and reads far below it. Accidentally voiding the cache multiplies the cost of every turn and moves no application metric: it is discovered on the end-of-month bill.

**Backing.** `source` — Anthropic, *Prompt caching* — https://docs.claude.com/en/docs/build-with-claude/prompt-caching (as of the consultation date: writes 25 % above base input with a 5-minute TTL, reads at 10 % of base price, 1-hour TTL at double the base price, breakpoints free) and OpenAI, *Prompt caching* — https://platform.openai.com/docs/guides/prompt-caching (minimum cacheable prefix of 1,024 tokens; on recent models the write costs 1.25× the uncached input rate, 30-minute TTL). The numbers are API-specific and change: verify them before budgeting. The design consequence is the same in both.

---

### G2. The model identifier is justified configuration, not a buried literal

**What it requires.** The model is resolved from a single point (named constant or configuration) and the choice is justified: first reach the accuracy target with the best available model, then replace it with a smaller one where the eval shows you can. Classifying, extracting a field or deciding a boolean do not need the most expensive model in the catalog.

**When it applies.** A `'<vendor>-<model>-<version>'` string inline in the call inside a service; the same identifier repeated in more than one file; a model copied from another service into a task of clearly different difficulty; every call in the system using the same model.

**Why it bites.** For maintainability, models are deprecated with a date: when the provider turns off the hardcoded one, the failure is a 404 in production and the fix is a blind `grep`. For cost, over-provisioning does not fail and that is why it survives for years: the result is correct and the line never gets looked at again, while the price difference between tiers is an order of magnitude, so a high-volume route solved with the expensive model can by itself be half the AI bill. The symmetric cost also exists: a model that is too small on a nuanced task produces subtle errors that reach the customer, and that is worse than expensive. The point is not "use the cheap one": it is "choose, and write down why".

**Backing.** `source + evidence`.
- `evidence` — "mal modelo igual, hoy otros mejores calidad precio" — PR #11237 (BE), `meeting-insights.service.ts` (Max); "es piola ese modelo, es al ojo?" — PR #7510 (BE), `meeting-group-analysis.service.ts` (Max). The second one is the right question to ask of any new model identifier.
- `source` — OpenAI, *A practical guide to building agents*, "Selecting your models" section: the procedure is (1) build evals for a baseline, (2) reach the accuracy target with the best models, (3) optimize cost and latency by swapping in small models where possible — "This way, you don't prematurely limit the agent's abilities, and you can diagnose where smaller models succeed or fail" — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf. Concurring: Anthropic, *Choosing the right model* — https://docs.claude.com/en/docs/about-claude/models/choosing-a-model.

---

### G3. Send to batch everything that does not need an immediate response

**What it requires.** Work with no latency requirement is submitted through the provider's batch processing mechanism.

**When it applies.** A queue job that makes N synchronous model calls and nobody cares whether it finishes in 5 or 50 minutes: running the full eval, enriching a backlog, generating embeddings or summaries for a corpus, classifying history.

**Why it bites.** You pay double for nothing. The tradeoff is bounded and known: no latency guarantee, results can come back in any order (they have to be matched by your own identifier), and the batch expires if it does not complete within 24 hours.

**Backing.** `source` — Anthropic, *Batch processing* — https://platform.claude.com/docs/en/build-with-claude/batch-processing: "most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput". API-specific; other providers offer equivalent mechanisms.

---

### G4. Optimize latency after quality, never before

**What it requires.** First get the prompt working with no model or length constraints; then apply latency reduction strategies.

**When it applies.** The fastest model is chosen before knowing whether the task is even solvable.

**Why it bites.** Trying to reduce latency prematurely prevents you from discovering what the quality ceiling looks like, and from then on every decision is made on a floor nobody knows was necessary.

**Backing.** `source` — Anthropic, *Reducing latency* — https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency: "It's always better to first engineer a prompt that works well without model or prompt constraints, and then try latency reduction strategies afterward". Useful detail from the same doc: asking for an exact word limit is ineffective because the model counts tokens, not words; asking for "in two paragraphs" or "in three sentences" works better.

---

### G5. Streaming where somebody is waiting; full response where nobody is

**What it requires.** Every call whose result a person reads in real time streams, and the metric being watched is time to first token, not just total latency. Every call whose result is processed in full before use gains nothing from streaming.

**When it applies.** A new blocking call in a handler that responds directly to a UI or a voice channel. In the opposite direction: streaming added to a queue consumer or to a call whose output is parsed in full.

**Why it bites.** Without streaming, time to first byte is total time, and in voice or chat that is abandonment: the user repeats the message, which generates another turn, more cost and a worse conversation. A dashboard that only plots total p95 is measuring what does not hurt the user. In the other direction, streaming on a path that does not need it adds an ugly failure mode: a stream that cuts off halfway returns partial output that looks complete (`output.md` B5).

**Backing.** `source` — Anthropic, *Reducing latency* — https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency, which distinguishes baseline latency from TTFT ("particularly relevant when you're using streaming and want to provide a responsive experience to your users"), and *Streaming messages* — https://docs.claude.com/en/docs/build-with-claude/streaming.

---

### G6. Model calls inside a loop need batching or bounded concurrency

**What it requires.** A `for`/`map` that calls the model per element must group several elements into one call, or run with an explicit, limited concurrency. Never sequential `await` over a list of unknown length, and never `Promise.all` over that list with no limit.

**When it applies.** An `await` to an LLM client inside a loop body, or a `Promise.all(items.map(...))` where the callback calls the model and `items` has no bounded length in the same diff.

**Why it bites.** Two opposite failures and both are real. Sequential `await` makes total latency the product of length and per-call latency: 200 elements times 2 seconds is nearly seven minutes, and the job dies by timeout halfway through having paid for every call that did complete. Unlimited `Promise.all` fires all 200 at once, eats the provider's concurrency quota, and the rate limit also takes down the real-user traffic sharing the account: a background job knocks over live chat.

**Backing.** `consensus`. Adjacent in the corpus: "revisar lo del regex en loop" — PR #8436 (BE) (Panda), the same "this runs N times" reflex applied to a prefilter, not to a model call.

---

### G7. The cost unit that matters is per user and per conversation, not per request

**What it requires.** When a diff adds a model call to an existing flow, the estimate is made over the complete business unit: a conversation, a processed contact, a ticket.

**When it applies.** A call added inside a handler that already runs per message, per turn or per webhook event; a new guardrail, classifier or enricher that runs before or after the main call.

**Why it bites.** Per request the number always looks small and always gets approved. If an average conversation has 20 turns, one extra call per turn is 20 calls. Multiplying by turns, contacts and clients is what turns a trivial decision into the biggest line on the bill, and the growth is not linear in users but in users times engagement: the customers who use the product the most are the ones with the worst margin.

**Backing.** `consensus`.

---

### G8. Two chained calls where one would have done

**What it requires.** If the output of one call only serves as input to the next with nothing external happening in between, you have to justify why there are two. A valid justification exists (a cheap call routing to an expensive one, or a step that needs data that can only be fetched afterwards), but it has to be explicit.

**When it applies.** Two `await`s to an LLM client in the same method, with no database call, external API call or tool between them that depends on the first result.

**Why it bites.** Latency adds up and variance adds up worse: if each call has a long tail at the 95th percentile, the combined p95 is considerably worse than double. In a conversational flow that is the difference between "it answers" and "it hung". Cost also doubles, and the second prompt usually resends much of the first one's context. The user notices immediately; the average latency metric does not, because the mean hides exactly the tail that matters (C9).

**Backing.** `consensus`.

---

### G9. Budget in tokens when the limit is hard, in characters when you are only bounding cost

**What it requires.** If the truncation exists to avoid exceeding the context window, the budget is computed in tokens with margin reserved for the response. If it exists only to bound cost, counting characters is enough.

**When it applies.** A character limit whose comment or constant name mentions the model's context limit; any assembly where several variable-length sources are summed with no total budget.

**Why it bites.** The characters-per-token ratio varies by language and by content: Spanish spends more tokens per character than English, and JSON, base64 or code spend considerably more than prose. A limit calibrated with English examples goes over the real limit when Spanish with emoji or a JSON payload comes in, and the failure is a hard provider error mid-production, when the conversation has grown long.

**Backing.** `source + debated`.
- `source` — the non-uniformity is measured: Ahia et al., arXiv:2305.13707 — https://arxiv.org/abs/2305.13707; Petrov et al., arXiv:2305.15425 — https://arxiv.org/abs/2305.15425. The per-language measurement procedure is in `NLP/tokenization.md` TK4.
- *Position B:* counting tokens requires a tokenizer in the request path (CPU and one more dependency) and with a wide margin the risk is theoretical.
- **Recommendation:** characters if the budget uses less than half the window; tokens if it approaches the limit or if the assembly sums more than two variable sources. **Tradeoff:** for bounding cost, characters are enough; for not breaking, they are not.

---

### G10. Every provider call carries an explicit timeout and a declared failure path

**What it requires.** A per-request timeout appropriate to the route, a bounded retry policy, and a defined path for when it fails or returns something unusable. The SDK default does not count as a decision, an interactive handler and a background job do not share the same value, and the failure path is written in the diff.

**When it applies.** A client construction or a new call with no timeout parameter and no cancellation signal; a `catch` that does `return null` or `return []` recording nothing; an `await llm(...)` in the synchronous path of a user request with no fallback.

**Why it bites.** SDK defaults are generous — on the order of ten minutes — because they are designed for long generations. The provider does not go down: it degrades, with p99 at 40 seconds. Requests pile up, hung connections occupy workers, the pool is exhausted and drags down routes that do not even use the model; the outage looks like general saturation and the diagnosis points at the database before the provider. A short timeout turns a diffuse incident into a clear, attributable error.

**Backing.** `consensus`.

---

### G11. Retries multiply worst-case latency, they do not add to it

**What it requires.** A retry policy defines maximum attempts, backoff with jitter, and which errors are retryable. The worst case — attempts times (timeout + wait) — has to fit within the route's budget, and that budget has to be written down.

**When it applies.** A new or modified `maxRetries`, a retry wrapper around a model call, or a retry function that also wraps the guardrails and post-processing.

**Why it bites.** Three retries over a 60-second timeout is a three-minute worst case nobody computed, and on an HTTP route that request has been dead for a while: the client already disconnected and the server keeps paying for calls for a response nobody will read. Worse when the retry is due to overload: retrying immediately and without jitter deepens the incident because the whole fleet retries in sync. The signal in the metrics is contradictory — error rate goes down while latency and cost explode — and that is why diagnosis takes long.

**Backing.** `consensus`. What stays inside and what stays outside the retry wrapper is a decision with consequences, not a detail (`agents.md` C-A11).

---

### G12. Model work nobody is waiting for goes to a queue

**What it requires.** If the result is not used in the HTTP response, the call does not belong on the request path: it is enqueued and the handler responds. This applies to summaries, enrichments, classifications, attribute extraction and any downstream analysis.

**When it applies.** An `await` to a model inside a controller or a webhook handler whose return value does not appear in the response body; or a model-based analysis added inside an existing `create`/`update`.

**Why it bites.** It turns your endpoint's latency and availability into the provider's. A webhook that used to answer in 50 ms now answers in 3 seconds, and many senders retry on timeout: duplicates arrive, and the duplicate calls the model again, so you pay twice for an event that may also be processed twice (`agents.md` C-A10). When the provider degrades, the endpoint returns 5xx and the sender may end up disabling the subscription.

**Backing.** `consensus`. The repository already has the queue infrastructure this principle assumes.

---

### G13. Rate limit and overload are transient: classify them separately

**What it requires.** Rate-limit and overload errors are retried with exponential backoff and jitter, respecting the retry-after header when the provider sends it, and they do not count as permanent errors in alerts nor consume the retries meant for real failures. The `catch` distinguishes the classes: malformed request, unauthorized, rate limit, transient overload, timeout, refused content.

**When it applies.** A handler where rate limiting falls into the same branch as client errors; a `catch (e)` that logs and returns without inspecting type or code; a job that marks the work as permanently failed on any provider error.

**Why it bites.** Each class has a different correct response and treating them together guarantees getting almost all of them wrong. Retrying a 401 burns quota against a credential that will not work. Not retrying a 429 throws away traffic that would have been saved by waiting a second. Swallowing a malformed-request error makes a prompt-construction bug — introduced yesterday — look like "the model sometimes does not answer" for weeks; when it is finally investigated, the log says `Error: request failed` and nothing else remains.

**Backing.** `consensus`.

---

### G14. Pricing written into the code expires

**What it requires.** If the code computes cost, per-token prices live in configuration with a last-reviewed date, not as scattered literals, and the computation tolerates an unknown model without returning zero.

**When it applies.** An object or `switch` mapping model identifier to per-token price; a magic number multiplying the input token count; any cost computation whose default case is `0`.

**Why it bites.** Prices go down and catalogs get renamed several times a year. An outdated map does not throw: it keeps reporting, with numbers that are no longer true. And defaulting to zero is worse than being outdated, because a new model — the one you most want to measure — reports zero cost and disappears from the dashboard exactly when it starts consuming (C12). The only signal is that the totals stop matching the invoice.

**Backing.** `consensus`. The volatility is documented by the providers themselves: the cacheable minimums, TTLs and multipliers cited in G1 change frequently and carry a consultation date.

---

### G15. When there are many tools, take their definitions out of the context

**What it requires.** With large tool catalogs, evaluate exposing them as code to execute instead of loading every definition up front.

**When it applies.** An agent with dozens of connected tools and a high input token count even on trivial requests. Easy to measure: send a "hello" and look at the input tokens.

**Why it bites.** Up-front loaded definitions occupy the context window on every request and intermediate results consume additional tokens. With agents connected to thousands of tools, "they'll need to process hundreds of thousands of tokens before reading a request".

**Backing.** `source` — Anthropic, *Code execution with MCP: Building more efficient agents* (November 4, 2025) — https://www.anthropic.com/engineering/code-execution-with-mcp. It is a recent provider proposal, not a settled practice. **Honesty note:** the post reports concrete token reductions that were not verified line by line; the mechanism and the diagnosis are cited, not a figure.

---

## H. Call observability

### H1. Persist the full trace, not the number

**What it requires.** For every call, what gets persisted is the prompt as it was sent (after all transformations, not before), the output as it arrived, the model identifier with its version, the generation parameters, and an identifier that correlates with the conversation or the business job. The same for an eval run: per case, the exact input, the retrieved context, the model output, the judge's reasoning and the score. This is the concrete instance of C14.

**When it applies.** A new call that does not go through the repository's tracing wrapper; an encoding, sanitizing or replacement step that happens outside the boundary where the trace is recorded; a diff that adds a grader, a score or a results table where the only thing persisted is a number or a boolean.

**Why it bites.** When a customer complains about a specific response, the only question that matters is what the model saw, and without the trace it is unanswerable: prompts are assembled at runtime from state that has already changed. In the eval the problem is symmetric: the score drops from 0.82 to 0.71 and there is no way to know whether retrieval brought back something else, the model changed format, or the judge got stricter — and since all three moved at once, the culprit cannot be isolated exactly when you have to decide whether to revert.

**Backing.** `source + evidence`.
- `evidence` — PR #9813 (BE), `ai-run-llm.service.ts` (Panda), cited in `agents.md` C-A11: the decode outside the `retryFunction` makes the trace record an intermediate form.
- `source` — infrastructure already existing in the repository: traces per `llm_call` are stored in S3 with input, output and reasoning, including the judge's reasoning (the `ai-traces` skill). If the trace can already be stored, not storing it is a decision, not a limitation.

---

### H2. Tokens and cost per operation, labeled with the business unit

**What it requires.** The consumption reported by the provider (input, output, and cache reads and writes separately) is recorded per call, with client, route and model labels, not just aggregated.

**When it applies.** A new call whose usage object is discarded; or an AI metrics layer that only increments a global counter with no dimensions.

**Why it bites.** Without attribution, the question "what raised the bill this month?" has no answer and the team ends up guessing or disabling things blindly. It is also the only way to detect unbounded text before the invoice: a 99th percentile of input tokens that separates from the median is exactly that signature (C16), and it is visible the day after the deploy. Separating cache reads from writes is what makes a prefix-cache regression visible (G1), which otherwise moves no application metric.

**Backing.** `consensus`.

---

### H3. Every generated response has to be traceable from the complaint

**What it requires.** The model execution identifier is propagated to the record of the message or artifact the user sees, so that from "this message from August 12" you can reach the trace in one query, without searching by time range.

**When it applies.** A new persistence of generated content (message, summary, enriched field) that does not store a reference to the execution that produced it.

**Why it bites.** The real complaint never comes with an exact time or an execution identifier: it comes with a screenshot. Without the stored reference, reconstructing means searching by client and time range across thousands of executions, and often you end up unable to state which one it was. That turns a ten-minute question into half a day, and in the ugly case — when the response committed to something commercially — it leaves the team unable to prove what the system generated and what it did not.

**Backing.** `consensus`.

---

### H4. Every degradation on the model path is counted, not logged

**What it requires.** Fallback taken, output discarded, truncation applied, retries exhausted, guardrail that blocked, prefilter that short-circuited: each one increments a labeled counter. Concrete instance of C13 on the inference path.

**When it applies.** A `catch` or a default-value `return` on the model path whose only observable effect is a log line.

**Why it bites.** Without a counter there is no way to answer "does this happen once a day or 30 % of the time?", which is the only question that decides whether it gets fixed, nor to detect that a model version change doubled the fallback rate.

**Backing.** `evidence` — PR #13095, PR #13096 and PR #13101 (BE) (Panda), cited in C13.

---

## What changed: widely cited practices no longer recommended the same way

Preserved intact; this is the item that belongs to security and operations.

6. **"Mitigating prompt injection" stopped being an achievable goal and became an architecture problem.** The 2023 position ("we filter the input, we put rules in the system prompt") is explicitly dismissed by the current standard: no fool-proof methods are known. What replaces the filter is least privilege, human approval and design patterns with provable guarantees. *Sources: OWASP LLM01:2025 — https://genai.owasp.org/llmrisk/llm01-prompt-injection/; Debenedetti et al., arXiv:2503.18813; Beurer-Kellner et al., arXiv:2506.08837.* See F2 and F8.

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- **NIST AI 100-2e2025** (*Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations*, published March 24, 2025) came up in searches and would be a valuable primary source for section F. **The PDF was not opened**, so none of its content is cited. The URL that came up in the search is https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf — verify it before using it.
- Several sources are **interested parties** in what they recommend: providers about their own APIs. It is flagged in each case. The numbers they publish are not replicated by independent third parties.
- **API prices and limits** (cacheable minimums, TTLs, cost multipliers, batch sizes) change frequently. They are annotated with a consultation date — August 15, 2026 — and must be verified against the provider's docs before being used in a calculation.
