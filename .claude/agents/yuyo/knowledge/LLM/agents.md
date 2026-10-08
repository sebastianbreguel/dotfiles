---
updated: 2026-08-16
ttl: 6 months
sources: 9
---

# Yuyo — LLM / Tools and agents

**What it covers.** What the model can do: deterministic workflow before agent, the model decides and the code executes, tool contracts and boundaries, parameters the system already knows, side-effecting tools versus read-only ones, tool return size and error messages that teach, loop caps, single agent versus many, exploratory subagents, idempotency of the unit of work, and context transformations applied and reverted at the same boundary.

**When to read it.** When the diff touches a tool definition, a tool handler, an agent loop, a tool registry, a hand-off between agents, or a consumer that calls the model and then writes. Always after `CORE.md`.

**Identifiers.** Entries in this file are cited as `C-A<n>` (kept from the original numbering so existing cross-references stay valid). Cross-file references name the file (`prompts.md` A12, `output.md` B9, `operations.md` F3, `retrieval.md` D5).

---

## C-A1. Start with the simplest thing: deterministic workflow before agent

**What it requires.** An agent is built only when the problem demands it. If the flow of steps is known in advance, it is a workflow. This is the instance of core C1 applied to architecture.

**When it applies.** An agent loop over a flow whose diagram can be drawn and does not change with the input. A diff that introduces agent orchestration over a task a single prompt with tools already solved.

**Why it bites.** Agentic systems trade latency and cost for flexibility, and that flexibility is not always needed. A `switch` with three model calls is cheaper, faster and more debuggable than a loop, and it does not have the "the model decided otherwise" failure mode.

**Backing.** `source` — Anthropic, *Building effective agents*: "we recommend finding the simplest solution possible […] Agentic systems often trade latency and cost for better task performance"; and "for many applications […] optimizing single LLM calls with retrieval and in-context examples is usually enough" — https://www.anthropic.com/engineering/building-effective-agents. OpenAI converges: "before committing to building an agent, validate that your use case can meet these criteria clearly. Otherwise, a deterministic solution may suffice" — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf.

---

## C-A2. The model decides, the code executes

**What it requires.** The model's output is a **declared decision**, not an action. The model returns data and a deterministic layer validates it and executes the effect. The output is never passed directly into something that writes, charges, sends or deletes.

**When it applies.** A handler where the model result reaches a `repository.save()`, a mutating `fetch`, a `queue.add()` or a message send with no validation function in between. Red flag: `const result = await llm(...)` followed a few lines later by a write that uses fields of `result` as parameters.

**Why it bites.** The model returns a `contact_id` with one digit changed or an `amount` it interpreted from another currency. The write happens against the wrong entity and there is no stack trace because the id exists: it belongs to another client. Detection comes from support, not from monitoring, and repair requires auditing every write in the period because you do not know which ones were correct.

**Backing.** `source + consensus` — OWASP Gen AI Security Project, *LLM05:2025 Improper Output Handling*, within the Top 10 2025 — https://genai.owasp.org/llm-top-10/: the LLM is not the final target, it is the intermediary through which an injection turns into an effect.

---

## C-A3. The tool description is its usage contract, and boundaries are designed

**What it requires.** The description answers three things: when to use it, when *not* to use it versus neighboring tools, and what it returns. Parameter names are self-explanatory and each carries its description with format and unit. And the set is designed: you choose which tools *not* to implement and use namespacing to mark boundaries.

**When it applies.** A new or modified tool definition; two tools whose descriptions a human would confuse; a parameter named `id`, `value`, `data` or `type` with no description; a new tool for every query variant instead of parameterizing one.

**Why it bites.** The model chooses by reading only those descriptions: two that overlap produce random choice and the symptom is "the assistant sometimes does the right thing". A parameter with no declared unit produces the classic bug — minutes where blocks were expected, pesos where cents were expected — and the value passes type validation because it is a number. The problem is not the number of tools but their overlap.

**Backing.** `source + evidence`.
- `source` — Anthropic, *Writing effective tools for agents*: "if a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better" — https://www.anthropic.com/engineering/writing-tools-for-agents. OpenAI: "The issue isn't solely the number of tools, but their similarity or overlap. Some implementations successfully manage more than 15 well-defined, distinct tools while others struggle with fewer than 10 overlapping tools" — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf.
- `evidence` — PR #6591 (BE), cited in `prompts.md` A12.

---

## C-A4. Do not expose to the model parameters the system already knows

**What it requires.** Connection data — token, shop, credentials, validation method, client identifier, limits, validation flags — is resolved on the server from the integration token or the authenticated session context. They are not tool parameters, they do not come from the frontend, and the model does not produce them.

**When it applies.** An assistant-function DTO that declares `token`, `shopUrl`, `clientId`, `apiKey` or a validation method among its properties; a handler that builds the call by reading a connection identifier or a validation rule from the input instead of from the token.

**Why it bites.** These are two surfaces in one. Quality: a parameter exposed to the model is a parameter the model will fill in with whatever seems coherent — a `shopUrl` invented from the brand name that came up in the conversation — and the call will go out to a domain that is not the client's; besides, every extra parameter is one more decision the model has to get right when the answer was already on the server. Security: the client can forge the identifier to operate against someone else's account, and if the argument is produced by the model and the model read third-party text, then that third party controls the argument — and the whole chain looks legitimate in the logs because every step did exactly what it was told.

**Backing.** `source + evidence`.
- `evidence` — "aca el validation debe venir del token. El cual se le debe agrgar el method cuando hago la conexión (usar adittional data)" and "esto no viene del front" — PR #4939 (BE), `return-products-functions.service.ts` (Panda); and in the same PR, about `create-return-products.dto.ts`: "agregar token".
- `source` — OWASP, *LLM06:2025 Excessive Agency* — https://genai.owasp.org/llmrisk/llm062025-excessive-agency/, on limiting permissions to the minimum and enforcing them in the destination system.

---

## C-A5. Separate read tools from side-effecting ones, and require human approval where appropriate

**What it requires.** Tools that mutate state or trigger external actions are explicitly distinguished from query tools. Their execution goes through a layer that verifies permissions on the server with the session's real identity, applies an idempotency key derived from their arguments, and limits invocations per conversation. Every tool is classified by risk — read versus write, reversibility, required permissions, financial impact — and high-risk ones return a proposal instead of executing.

**When it applies.** A registry where writes and reads are dispatched through the same path with no distinction; an executor that does `Promise.all` over all the tool calls in a turn; a mutating tool with no idempotency key; a handler that does a `save`, a `delete`, an external `POST` or a send with no permission check of its own because "it was already checked on entering the conversation".

**Why it bites.** The model is an untrusted client: it can emit the same tool call twice in consecutive turns, it can call it with arguments no UI flow would allow, and it can be induced to call it by text it read (`operations.md` F3). If the tool creates an order, two get created. Without idempotency, a retry from the framework itself duplicates an order or a charge. Without a cap, a reasoning loop sends forty messages to the same contact in a minute. Read tools tolerate all of this perfectly, and that is why the "execute everything together" pattern passes review: it was tested with reads. The effect has already happened on the far side of an external system where it cannot be undone.

**Backing.** `source` — OpenAI, *A practical guide to building agents*, "Tool safeguards" and "Plan for human intervention" sections: classify by "read-only vs. write access, reversibility, required account permissions, and financial impact", and trigger human intervention on failure thresholds or high-risk actions — "canceling user orders, authorizing large refunds, or making payments" — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf. Concurring: OWASP LLM01 mitigation 5 — https://genai.owasp.org/llmrisk/llm01-prompt-injection/. The authorization half also has local precedent in PR #4939 (C-A4).

---

## C-A6. Return little and useful from tools, and make errors teach

**What it requires.** Optimize the *amount* of context tools return, not just its quality: pagination, range selection, filtering and truncation with sensible defaults and an explicit cap (C16). And when a tool fails or rejects arguments, the message that goes back to the model says what was wrong and what is expected, in terms of the action to take: not a stack trace, not an opaque code, and without prescribing a correction that is wrong for some cases.

**When it applies.** A tool that returns the raw API response or the full result of a `SELECT`. A `throw new Error(...)` whose message reaches the model's context. A validation message that instructs ("consolidate the repeated items", "use the short format") instead of describing ("item X appears twice with different prices").

**Why it bites.** An opaque error produces an identical retry or an abandonment: the model has no information with which to change strategy and the loop burns itself on repetition. The *over-prescriptive* error is worse and less obvious: if the message says "consolidate repeated concepts into a single item with the combined quantity" and the duplication was a legitimate tiered price, the model obeys and produces a miscalculated quote. A message written for the frequent case turns a valid case into wrong data, and the model looks perfectly cooperative while doing it.

**Backing.** `source + evidence`.
- `evidence` — "**Behavioral: this error message steers the model into wrong quotes for tiered pricing.** 'Consolidate repeated concepts into a single item with the combined quantity' es exactamente lo incorrecto cuando el duplicado es un tier legítimo" — PR #10864 (BE), `compute-quote.ts`. For size: PR #9629 (BE), `ai-tool-call.service.ts` (Max), cited in C16.
- `source` — Anthropic, *Writing effective tools for agents*: "For Claude Code, we restrict tool responses to 25,000 tokens by default"; and "if a tool call raises an error […] you can prompt-engineer your error responses to clearly communicate specific and actionable improvements, rather than opaque error codes or tracebacks" — https://www.anthropic.com/engineering/writing-tools-for-agents.

---

## C-A7. No agent loop without a cap and without an exit

**What it requires.** Every cycle where the model can request another tool carries an explicit exit condition, a maximum number of iterations, a total time budget, and defined behavior on exhaustion that is neither hanging nor retrying. The cap is expressed as a named constant.

**When it applies.** A `while (response.tool_calls)` or equivalent recursion with no counter; a counter whose exhaustion path does a generic `throw` or goes back to the start; an agent that can call another with no maximum depth.

**Why it bites.** An infinite loop with an LLM does not lock up: each pass costs real latency and grows the context, so it gets slower and slower until it blows past the window or the provider timeout. A model that cannot satisfy a condition alternates between two tools indefinitely, very confidently. Without a cap, a single pathological case consumes an entire worker for minutes and every other job waits behind it.

**Backing.** `source` — OpenAI, *A practical guide to building agents*, "Single-agent systems" section: common exit conditions are invocation of a final-output tool, a determined structured output, errors, or reaching a maximum number of turns — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf. The turn limit also connects to OWASP *LLM10:2025 Unbounded Consumption* — https://genai.owasp.org/llm-top-10/: unbounded consumption is a security risk, not only a cost one.

---

## C-A8. One agent until it is proven that two are needed

**What it requires.** Decomposing into multiple agents is justified with a mechanical reason: contexts that do not fit together, tools whose access must be separated, or parts that must genuinely run in parallel. Before splitting, you try improving tool clarity (C-A3). If you do split, the hand-off contract is an explicit schema, not free text between agents.

**When it applies.** A proposal of "one agent per domain" before having tried with one; agents whose prompts overlap; an agent whose only function is to forward context to another.

**Why it bites.** Every hop is a serialization of state and information is lost at each one — nuances of the original request, ambiguities the first agent resolved its own way. Errors compound: two stages at 90 % give 81 %. Debugging goes from reading one trace to correlating several, with the aggravating factor that the failure is usually in the hand-off, the only place with no prompt to review. And the cost is on the order of 15 times that of a chat.

**Backing.** `source + debated`.
- `source` — OpenAI: "Our general recommendation is to maximize a single agent's capabilities first" — https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf. Anthropic, *How we built our multi-agent research system* (June 13, 2025) — https://www.anthropic.com/engineering/multi-agent-research-system: "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats. For economic viability, multi-agent systems require tasks where the value of the task is high enough to pay for the increased performance"; and it does not apply where all agents need the same context or where there are many dependencies among them — "most coding tasks involve fewer truly parallelizable tasks than research".
- *Position A:* one agent and well-described tools; split only for a mechanical reason. *Position B:* there are real, measured improvements with multi-agent architectures on broad, parallelizable research tasks.
- **Recommendation:** the question is not "does it work better?" but "does the value of the task pay 15x the token cost?". **Tradeoff:** you give up parallelism where it would help, in exchange for a single, debuggable trace. The 15x figure comes from one concrete system and is not a universal constant.

---

## C-A9. Isolate exploratory work in subagents with clean context

**What it requires.** When a phase generates a lot of intermediate noise and only the conclusion matters, it is delegated to a subagent with a clean window that returns a distilled summary.

**When it applies.** A phase that reads thirty files or runs twenty searches to answer one question, with all that material accumulating in the main context.

**Why it bites.** The main context fills with intermediate material that no longer contributes, and from then on every turn costs more and obeys less (`prompts.md` A5). Isolating keeps the coordinator's context small and stable, which is also the one that caches best.

**Backing.** `source` — Anthropic, *Effective context engineering for AI agents*: each subagent explores in depth but "returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)" — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents. It is a recent provider proposal, not a universally settled practice, and its cost falls under the 15x caveat (C-A8).

---

## C-A10. Make the unit of work idempotent, not the model call

**What it requires.** Wherever there is a retry — queue, cron, webhook, client retry — the observable effect is protected with an idempotency key derived from the input, not from the model output. Reprocessing the same input must converge to the same final state.

**When it applies.** A queue consumer that calls an LLM and then writes; a webhook endpoint with content generation; any `queue.add()` whose handler invokes the model and produces an external effect.

**Why it bites.** The job makes the call, writes, and fails on the ack. The queue retries. The second pass produces different text — it is a model, not a pure function — and writes a second row that is not an exact duplicate of the first, so no uniqueness constraint stops it. The user receives two similar but not identical messages, and deduplicating afterwards is automatically impossible precisely because they are not identical.

**Backing.** `consensus`.

---

## C-A11. Context transformations are applied and reverted at the same boundary

**What it requires.** If the system encodes something before sending it to the model (URL placeholders, anonymization, reference tokens), decoding happens inside the same boundary that wraps retries, guardrails, validations, logging and persistence — not after.

**When it applies.** An encode/decode function around the call where the `decode` sits outside the retry wrapper; an encode before a validation pipeline with the decode at the end.

**Why it bites.** With decode outside the retry, everything running inside sees placeholders instead of real values: a guard looking for suspicious URLs sees no URL at all and can detect nothing, and the run logs store placeholders, so the trace is useless exactly when someone is trying to investigate an incident (`operations.md` H1).

**Backing.** `evidence` — "**Decode fuera del `retryFunction` deja `url-N` en guardrails y run logs.** El decode corre acá, *después* de que `retryFunction` retorna. Eso significa que todo lo que se ejecuta adentro del retry ve placeholders en vez" of the real value — PR #9813 (BE), `src/ai/ai-run-module/core/services/ai-run-llm.service.ts` (Panda). The collision between the placeholder pattern and user text is a separate principle (`operations.md` F12).

---

## Source limitations for this file

Recorded explicitly, in line with the rule of not citing what was not read. Preserved intact.

- Anthropic's **tool use documentation** (https://docs.claude.com/en/docs/build-with-claude/tool-use/overview) was consulted but is not cited for specific content.
