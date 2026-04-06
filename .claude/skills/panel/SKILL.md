---
name: panel
description: "Three-lens evaluation panel that gives multi-perspective feedback on any decision — technical, product, or strategic. Applies three complementary lenses: Simplification (strip to essentials), Architecture (is the structure right?), and Product (does it earn its place?). Use this skill whenever the user wants a second opinion, multi-angle feedback, or needs to stress-test a decision before committing. Trigger on: '/panel', 'panel review', 'get perspectives on', 'what would the panel think', any request for multi-angle evaluation of code, design, architecture, product, strategy, or business decisions. Also trigger when the user seems stuck between two options or wants validation before a big decision."
---

# Iconic Panel

Three lenses, one verdict. Every decision has blind spots — this skill cancels them out by running three complementary perspectives in parallel.

## The Three Lenses

The panel presents perspectives as abstract lenses, not as named individuals. Each lens is powered by a personality agent underneath, but the user sees the lens:

| Lens | Focus | Question it asks | Powered by |
|------|-------|-----------------|------------|
| **Simplificación** | Compression, essentials, first-order terms | "What's the simplest version that works?" | `andrej-karpathy` |
| **Arquitectura** | Structure, premises, first principles | "Is this even the right formulation?" | `yann-lecun` |
| **Producto** | Scope, user value, discipline | "Does this earn its place?" | `tw93` |

## Mode Detection

Detect automatically from the user's input. Never ask.

| Mode | Signal | Each lens does |
|------|--------|----------------|
| **Review** | Code, files, PRs, diffs, "review this", existing systems | Critique what exists |
| **Design** | "Should we", "how to", proposals, decisions to make | Shape the decision |
| **Evaluate** | "X vs Y", concepts, strategies, approaches, "what about" | Deliver verdicts |

If ambiguous, default to **evaluate**.

## Depth Adaptation

Match response depth to the complexity of the input:

- **Simple question** (clear-cut, one variable): each lens gives 2-3 sentences. Total panel output stays under 300 words.
- **Medium question** (trade-offs, multiple factors): each lens gives a short paragraph (80-150 words). Total ~500 words.
- **Complex question** (multi-system, strategic, lots of context): each lens gives 150-250 words. Total ~800 words.

Judge complexity by: how many systems/stakeholders are involved, how many trade-offs exist, how much context the user provided. More context = they want deeper analysis.

## Honesty About Expertise

The three lenses come from engineering and product thinking. When applied to domains outside their core expertise (legal, medical, financial, marketing, HR, etc.):

- Each lens still applies its perspective — simplification, architecture, and scope discipline are universal thinking tools
- But the synthesis must include an honest note: "This panel's expertise is engineering and product. Our lenses apply here but we're not domain experts in [X]. Take the structural insights, verify the domain-specific ones."

This is not a disclaimer that weakens the output — it's calibration that makes it trustworthy.

## Execution

### Step 1: Gather context

Before dispatching, understand what the lenses need:
- **Review**: Read the actual code/diff. No lens should critique blind.
- **Design**: Check existing patterns so advice fits the project.
- **Evaluate**: Understand the subject well enough to brief clearly.

Write a context brief that gives each lens everything it needs. Include: what it is, what's at stake, what the user is trying to decide. Keep it proportional to the question's complexity.

### Step 2: Dispatch three agents in parallel

Launch ALL THREE in a SINGLE message using the Agent tool. One call per lens. All in one message — this is what makes them parallel.

Each agent uses its `subagent_type` which loads the personality profile automatically:
- `andrej-karpathy` for Simplificación
- `yann-lecun` for Arquitectura
- `tw93` for Producto

**Prompt to each agent:**
```
[MODE]: You are [reviewing / advising on / evaluating] the following.

CONTEXT:
{context_brief}

MATERIAL:
{the actual code, question, concept, or strategy}

DEPTH: {simple | medium | complex}

Respond with your honest perspective. Be specific — reference actual details from the material, not abstract principles. If this topic is outside your core expertise, say so honestly but still apply your lens — your thinking framework is valuable even in unfamiliar domains.

End with a clear verdict: what would you do and why?
```

### Step 3: Synthesize

After all three return, YOU synthesize. Present in the user's language.

**Format:**

```markdown
## Panel: {mode} — {subject one-liner}

### Simplificación
{perspective in this lens's voice — essentials, compression, what can be stripped}

### Arquitectura
{perspective in this lens's voice — structure, premises, is the formulation right}

### Producto
{perspective in this lens's voice — scope, user value, does each piece earn its place}

### Consenso
{Where all three converge. High-signal — if three different thinking styles agree, pay attention.}

### Tensión
{Where they disagree. Name the trade-off explicitly. This is where the real decision lives.}

### Veredicto
{Your synthesized recommendation. Actionable — what specifically should the user do next?}
```

If any lens flagged a domain expertise gap, add after the verdict:
```markdown
> **Nota:** Este panel piensa desde ingeniería y producto. [Specific caveat about domain expertise gap].
```

## Key Rules

1. **Never ask which mode** — detect and run
2. **Always parallel** — three Agent calls in one message
3. **Lenses, not names** — present as Simplificación / Arquitectura / Producto, not Karpathy / LeCun / tw93
4. **Each lens must be distinct** — if you can swap the labels and the text still reads the same, the synthesis is too generic
5. **Depth matches complexity** — don't write 800 words for a simple question, don't write 200 for a complex one
6. **Honest about limits** — flag when the topic is outside core expertise, but still apply the lenses
7. **Synthesis is YOUR job** — find where perspectives intersect or collide, don't just summarize
8. **Actionable verdicts** — the user should know what to do next, not just what to think about
9. **Match the user's language** — agents respond in English, you synthesize in whatever language the user writes in
10. **Expandable** — the three default lenses can be extended in the future by adding more personality agents. The structure supports N lenses, not just 3.
