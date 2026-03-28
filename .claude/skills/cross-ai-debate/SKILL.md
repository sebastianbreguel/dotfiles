---
name: cross-ai-debate
description: >
  Cross-AI adversarial debate between Claude Code, Codex CLI, and Gemini CLI.
  The user provides a task (what to analyze) and evaluation criteria (how to judge it).
  Three AI systems with different training and biases then debate across multiple rounds,
  scoring each criterion, identifying gaps, and producing actionable improvement proposals.

  Use this skill whenever the user says "debate", "cross-AI review", "adversarial review",
  "claude vs codex", "claude vs gemini", "three-way debate", "let them argue", "AI debate",
  "multi-AI review", or wants multiple AI systems to analyze code/architecture from
  opposing perspectives. Also trigger when the user mentions wanting diverse AI opinions
  on any technical decision.
---

# Cross-AI Debate — Claude Code vs Codex CLI vs Gemini CLI

Three AI systems with different training, biases, and reasoning styles debate a
task you define. This produces genuinely adversarial analysis because the models
are fundamentally different — not one model pretending to disagree with itself.

**What this is NOT**: No code changes. Pure analysis that surfaces ideas for you
to evaluate and implement later.

---

## User Input — Three Things Required

Ask the user for these three things before starting:

### 1. Task — What to analyze

A natural-language description of what the three AIs should debate. Examples:
- "Review the authentication system in `src/auth/`"
- "Evaluate whether our API design is scalable"
- "Analyze the data pipeline for reliability issues"
- "Compare our current architecture vs a microservices approach"
- A file path like `src/pipeline_system/` (interpreted as "review this code")

### 2. Criteria — How to evaluate

How the debaters should judge the subject. Three formats accepted:

**A) File path** — Points to a document with evaluation dimensions:
```
criteria: benchmark/BENCHMARK_RUBRIC.md
```
Read the file, extract all dimensions, descriptions, and scoring scales.

**B) Comma-separated list** — Quick custom dimensions:
```
criteria: security, performance, cost efficiency, developer experience
```
Each becomes a 1-5 scored dimension.

**C) Omitted** — Uses these 7 sensible defaults:
1. **Architecture** — Is the design clean, modular, and appropriate?
2. **Code Quality** — Readability, naming, DRY, complexity management
3. **Performance** — Efficiency, scalability bottlenecks, resource usage
4. **Security** — Input validation, auth, secrets management, OWASP concerns
5. **Reliability** — Error handling, edge cases, failure modes, observability
6. **Maintainability** — How easy is it to change, extend, and debug?
7. **Testing** — Coverage, test quality, confidence in correctness

### 3. Roles — What perspective each debater brings

Each debater gets a specialized role that shapes their analysis. Examples:

```
roles:
  claude: "NLP metrics specialist — evaluate metric correctness for each data type"
  codex: "Data pipeline architect — evaluate reproducibility, efficiency, implementation"
  gemini: "Product analyst — evaluate if what's measured actually matters for the business"
```

**If omitted** — Each debater uses their general perspective (no specialized role).

Roles are injected into each debater's prompt as: "Your role in this debate: {role}. Argue from this perspective."

---

## Automatic Defaults (user does NOT need to specify these)

| Setting | Default | Override syntax |
|---------|---------|-----------------|
| Rounds | 2 | `rounds: 3` |
| Debaters | all (Claude + Codex + Gemini) | `debaters: claude+codex` |
| Mode | adversarial | `mode: collaborative` or `mode: focused` |
| Focus | all dimensions | `focus: security,performance` |
| Codex Model | gpt-5.4 | `codex-model: gpt-5.4-mini` |
| Gemini Model | gemini-3.1-pro | `gemini-model: gemini-2.5-pro` |

The user can add any override inline, but they never have to.

---

## Execution Flow (runs automatically after user provides task + criteria)

### Phase 1 — Gather Evidence

1. Parse the task to identify the subject (files, modules, architecture)
2. Auto-detect evidence files from the subject:
   - Project overview files: `README.md`, `CLAUDE.md`, `docs/vambe.md`
   - Config files: `.yaml`, `.toml`, `.json`
   - Entry points and orchestration files
   - Core business logic modules
   - Limit to ~15 most relevant files
3. If criteria is a file path, read it and extract dimensions
4. Read all evidence files to build shared context

### Phase 2 — Set Up Workspace

```bash
DEBATE_TAG=$(date +%Y%m%d-%H%M)
mkdir -p debate/${DEBATE_TAG}
```

Create `debate/${DEBATE_TAG}/context.md` with:
- **Task**: What was asked and why
- **Architecture overview**: Key components, data flow, tech stack
- **Criteria summary**: All dimensions with descriptions and scoring scale
- **Key findings from evidence**: Notable patterns, configs, or issues
- **Known issues**: Anything obvious from reading the code

Initialize `debate/${DEBATE_TAG}/debate.md`:

```markdown
# Cross-AI Debate — ${DEBATE_TAG}
## Claude Code vs Codex CLI vs Gemini CLI

**Task:** ${TASK}
**Criteria:** ${CRITERIA_SUMMARY}
**Mode:** ${MODE}
**Rounds:** ${ROUNDS}

### Roles
- **Claude Code**: ${CLAUDE_ROLE or "General perspective"}
- **Codex**: ${CODEX_ROLE or "General perspective"}
- **Gemini**: ${GEMINI_ROLE or "General perspective"}

### Evaluation Dimensions
[List each dimension with description and 1-5 scoring scale]

---
```

### Phase 3 — Debate Loop

Run for N rounds. Never ask the user if you should continue mid-debate.

#### Round N — Claude Code's Turn

**Your role**: ${CLAUDE_ROLE}. Argue from this perspective throughout.

**Think deeply** before writing. Consider:
- Strongest critiques against each criterion **from your role's perspective**
- Specific evidence (files, line numbers, config values)
- If responding to previous rounds: where are the others wrong? Right but for wrong reasons? Missed something?

**Write to the debate log:**

```markdown
## Round N — Claude Code

### Critique / Response
[Main argument — specific, cite files and line numbers]

### Dimension Scores
| Dimension | Score (1-5) | Evidence |
|-----------|-------------|----------|
| [dim 1] | X | [specific evidence] |
| ... | | |

### Key Gaps
[What's missing, broken, or could be significantly improved?]

### Improvement Proposals
1. [Specific proposal with expected dimension impact]

### Challenge to Codex & Gemini
[A specific question or claim for the others to address]
```

#### Round N — Codex's Turn

```bash
cat debate/${DEBATE_TAG}/context.md debate/${DEBATE_TAG}/debate.md > /tmp/debate_input.md

codex exec \
  -m ${CODEX_MODEL} \
  --cd "$(pwd)" \
  -o debate/${DEBATE_TAG}/codex_round_N.md \
  "$(cat <<'PROMPT'
You are participating in a structured cross-AI debate.
You are Codex (OpenAI), debating against Claude Code (Anthropic) and Gemini (Google).

## Your Assigned Role
${CODEX_ROLE or "General perspective — no specific role assigned"}
Argue from this perspective throughout. Your expertise shapes what you notice and prioritize.

## Your Job
- Read the shared context and debate history provided below
- Respond to the latest round(s) with your own analysis **from your role's perspective**
- Challenge assumptions, propose alternatives, agree where warranted
- Score against ALL evaluation dimensions listed in the context with evidence
- Propose specific improvements with expected impact

## Rules
- Be specific — cite file names, line numbers, config values
- Don't be contrarian for its own sake — agree when the evidence supports it
- Focus on what would actually improve the scores
- Address challenges directed at you directly
- End with your own challenge back to the other debaters

## Output Format
## Round N — Codex

### Critique / Response
### Dimension Scores
### Key Gaps
### Improvement Proposals
### Challenge to Claude & Gemini
PROMPT
)"
```

Append Codex output to debate log:
```bash
cat debate/${DEBATE_TAG}/codex_round_N.md >> debate/${DEBATE_TAG}/debate.md
```

#### Round N — Gemini's Turn

```bash
cat debate/${DEBATE_TAG}/context.md debate/${DEBATE_TAG}/debate.md > /tmp/debate_input.md

cat /tmp/debate_input.md | gemini \
  -m ${GEMINI_MODEL} \
  -p "$(cat <<'PROMPT'
You are participating in a structured cross-AI debate.
You are Gemini (Google), debating against Claude Code (Anthropic) and Codex (OpenAI).

## Your Assigned Role
${GEMINI_ROLE or "General perspective — no specific role assigned"}
Argue from this perspective throughout. Your expertise shapes what you notice and prioritize.

## Your Job
- Read the shared context and debate history provided via stdin
- Respond to both Claude's and Codex's latest rounds with your own analysis **from your role's perspective**
- Bring a fresh perspective — challenge both, agree where warranted, propose alternatives
- Score against ALL evaluation dimensions listed in the context with evidence
- Propose specific improvements with expected impact

## Rules
- Be specific — cite file names, line numbers, config values
- Don't be contrarian for its own sake — agree when the evidence supports it
- Focus on what would actually improve the scores
- Address challenges directed at you directly
- End with your own challenge back to the other debaters

## Output Format
## Round N — Gemini

### Critique / Response
### Dimension Scores
### Key Gaps
### Improvement Proposals
### Challenge to Claude & Codex
PROMPT
)" \
  --yolo \
  -s false \
  > debate/${DEBATE_TAG}/gemini_round_N.md 2>/dev/null
```

Append Gemini output to debate log:
```bash
cat debate/${DEBATE_TAG}/gemini_round_N.md >> debate/${DEBATE_TAG}/debate.md
```

#### Between Rounds — Synthesis Check

Every 2 rounds, add a synthesis section:

```markdown
## Synthesis — Rounds N-1 & N

### Points of Agreement
- [What all debaters agree on]

### Points of Contention
- [Where they disagree — note 2v1 splits vs three-way disagreements]

### Emerging Priorities
- [Proposals ranked by dimension impact]
```

### Phase 4 — Final Report

Create `debate/${DEBATE_TAG}/report.md`:

```markdown
# Debate Report — ${DEBATE_TAG}

## Executive Summary
[2-3 sentences: what was debated, what emerged]

## Task
${TASK}

## Criteria
${CRITERIA_SUMMARY}

## Consensus Scores
| Dimension | Claude | Codex | Gemini | Consensus | Key Evidence |
|-----------|--------|-------|--------|-----------|--------------|
| [dim 1] | X | X | X | X | ... |
| ... | | | | | |

## Key Gaps Identified
| Gap | Severity | All Agree? | Proposed Fix |
|-----|----------|------------|--------------|
| ... | High/Med/Low | Y/N | ... |

## Top Improvement Proposals (ranked by dimension impact)
1. [Proposal] — impacts: [dims] — proposed by: [who]

## Unresolved Disagreements
- [What they couldn't agree on — these are the interesting bits]

## Recommended Next Steps
[Ordered list of actions based on debate findings]
```

Print the report path and a 3-line summary to the user.

---

## Debate Modes

### Adversarial (default)
Each debater actively looks for flaws in the other's reasoning.

### Collaborative
Each debater builds on the other's ideas. Prompts include:
"Build on the others' analysis. What did they miss that strengthens their argument?"

### Focused
Set `focus: performance,security` to debate only specific dimensions.
All scoring still happens, but arguments focus on the selected dimensions.

---

## CLI Invocation Reference

### Codex CLI

**Default model**: `gpt-5.4`
**Available**: `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.3-codex`, `gpt-5.2-codex`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1-codex-mini`

**Sandbox**: If fails due to sandbox, retry with:
```bash
codex exec -c 'sandbox_permissions=["disk-full-read-access"]' ...
```

**Timeout**: 2-5 minutes per round. Be patient.

**Failure handling**: Retry once with simpler prompt. If still fails, log "Codex unavailable for round N" and continue.

### Gemini CLI

**Default model**: `gemini-3.1-pro`
**Available**: `gemini-3.1-pro`, `gemini-3-flash`, `gemini-2.5-pro`, `gemini-2.5-flash`, `auto`

**Key flags**:
- `-p "prompt"` — headless mode (required for automation)
- `-m model` — model selection
- `--yolo` — auto-approve tool calls
- `-s false` — disable sandbox for file reads

**Timeout**: 2-5 minutes per round. Be patient.

**Failure handling**: Retry once with simpler prompt. If still fails, log "Gemini unavailable for round N" and continue.

---

## Output Files

```
debate/${DEBATE_TAG}/
  context.md          — shared evidence summary
  debate.md           — full debate transcript (append-only)
  codex_round_1.md    — raw Codex output per round
  codex_round_2.md
  gemini_round_1.md   — raw Gemini output per round
  gemini_round_2.md
  report.md           — final synthesis report
```

---

## Tips for Better Debates

- **Be specific in your task**: "Review auth system for OWASP Top 10 compliance" beats "review the code"
- **Provide a criteria file**: Richer criteria = more structured debate
- **Include output/data files**: Debates grounded in real outputs are far richer
- **Use focused mode**: For deep dives, focus on 2-3 dimensions instead of all
