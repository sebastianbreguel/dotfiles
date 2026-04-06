# Gemini Prompt Templates

Templates for invoking Gemini CLI at each debate stage. Claude reads this file
and adapts the prompts based on the current round and debate history.

**Key difference from Codex**: Gemini receives context via stdin (piped) and the
prompt via `-p`. It uses `--yolo` for auto-approval and `-s false` to disable sandbox.

## Round 1 — Opening Statement

Gemini has no prior debate context beyond what Claude and Codex already said.

```
You are Gemini (Google), participating in a structured cross-AI debate against
Claude Code (Anthropic) and Codex (OpenAI).

## Context
The shared context and full debate history have been provided via stdin.
Read it carefully before responding.

## Your Task
1. Read the shared context (subject description, evaluation criteria, evidence files)
2. Read Claude's and Codex's opening critiques
3. Write your response: agreements, disagreements, and your own fresh analysis
4. Score each evaluation dimension (1-5) with specific evidence from the code
5. Identify gaps or issues the others missed
6. Propose improvements with expected impact on scores
7. End with a challenge question for both Claude and Codex

## Important
- Read the evidence files listed in the shared context for additional detail
- Be specific — cite file names, line numbers, config values
- Bring a perspective the others may have missed
- Don't just echo what was already said — add value

## Debate History So Far
{provided via stdin}

## Output Format
Write markdown following this structure:
## Round 1 — Gemini

### Critique / Response
### Dimension Scores (1-5 with evidence)
### Key Gaps
### Improvement Proposals
### Challenge to Claude & Codex
```

## Round N (N > 1) — Response Round

Gemini has the full debate history. Focus on responding to both Claude's and Codex's latest points.

```
You are Gemini (Google) in round {N} of a three-way debate with Claude Code
(Anthropic) and Codex (OpenAI).

## Rules
- Respond directly to both Claude's and Codex's Round {N} arguments
- Address any challenges directed at you explicitly
- Revise your dimension scores if others presented convincing evidence
- Don't repeat points already made — build on or challenge them
- Be specific: cite files, line numbers, config values, output data
- Note where Claude and Codex agree or disagree with each other — pick sides or propose a third view

## Debate History
{provided via stdin}

## Output
## Round {N} — Gemini

### Response to Claude's & Codex's Round {N}
### Updated Dimension Scores (if changed, explain why)
### New Proposals (if any)
### Challenge to Claude & Codex
```

## Collaborative Mode Variant

Replace adversarial framing with:

```
You are Gemini (Google), collaborating with Claude Code (Anthropic) and Codex
(OpenAI) to analyze a codebase. Your goal is to build on each other's insights —
not to win an argument, but to produce the most complete analysis possible.

Where the others identified weaknesses, dig deeper into root causes.
Where they missed something, add it constructively.
Where you disagree, explain your reasoning without being combative.
Look for synthesis opportunities — can two partial ideas combine into a better one?
```

## Focused Mode Variant

Add to any prompt:

```
## Focus Dimensions
This debate focuses specifically on: {FOCUS_DIMENSIONS}

While you should still score all dimensions, spend 80% of your analysis
on the focused dimensions. Go deeper on these — examine specific code paths,
configurations, and patterns that affect these scores.
```

## Invocation Examples

### Basic round
```bash
cat /tmp/debate_input.md | gemini \
  -m gemini-3.1-pro \
  -p "You are Gemini in round 1 of a debate... [full prompt]" \
  --yolo \
  -s false \
  > debate/${DEBATE_TAG}/gemini_round_1.md 2>/dev/null
```

### With specific model
```bash
cat /tmp/debate_input.md | gemini \
  -m gemini-2.5-pro \
  -p "..." \
  --yolo \
  -s false \
  > debate/${DEBATE_TAG}/gemini_round_1.md 2>/dev/null
```

### With auto model selection
```bash
cat /tmp/debate_input.md | gemini \
  -p "..." \
  --yolo \
  -s false \
  > debate/${DEBATE_TAG}/gemini_round_1.md 2>/dev/null
```
