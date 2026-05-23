# Source Gate

The single rule that separates `tech-research` output from a generic LLM brain
dump. Hold the bar — without it the produced reference becomes opinion-shaped
and the downstream audit inherits the rot.

## What counts as primary

A source is **primary** when it is one of:

- Official documentation of the tool, framework, language, or standard.
  Examples: `kubernetes.io/docs`, `nextjs.org/docs`, `pkg.go.dev`,
  `doc.rust-lang.org`, `developer.apple.com`, `learn.microsoft.com`.
- A specification document. Examples: RFC, PEP, JEP, W3C, OWASP standard,
  CIS benchmark, NIST publication, ECMA standard, ISO standard.
- The maintainer's own blog, conference talk, or release notes — when the
  author is identifiable as a maintainer (commit history, GitHub org
  membership, conference billing).
- A first-party security advisory (GHSA, CVE record with vendor confirmation,
  vendor PSIRT bulletin).
- The project's own design docs, ADRs, or RFCs in the project repo.

## What does not count as primary

Reject as primary citation:

- Tutorial sites (`tutorialspoint`, `geeksforgeeks`, `w3schools`, generic
  Medium posts).
- Listicles, "top 10" articles, content-marketing posts on vendor blogs that
  are not technical specs.
- StackOverflow answers — useful as **signal that a problem exists**, not as
  citation. If a SO answer points at a primary source, cite the primary
  source, not the SO link.
- AI-generated summary content (Bing Copilot answers, Perplexity threads,
  most "ultimate guide" posts on aggregator sites).
- Training-bootcamp blogs, certification-prep sites, and any source whose
  business model is search-result placement rather than maintenance.
- Anything undated — if you cannot establish a publish or update date, the
  source cannot pass the date gate, so reject.

## Date threshold

Default cutoff: **2025-01-01**. Newer is fine. Older is rejected unless one
of these exceptions applies:

- **Stable specs**: RFC, PEP, JEP, W3C Recommendation, OWASP Top 10 (cite
  edition), CIS, NIST, ECMA, ISO. Cite the version explicitly. Example:
  `OWASP Top 10:2021` — fine to cite forever as long as it is the current
  edition.
- **Foundational papers** (CAP, Raft, Paxos, etc.) when used to anchor a
  conceptual rule, not a tooling rule.
- **Deprecation announcements**: a 2022 post saying "library X is
  end-of-life" is fine to cite for a `dead on sight` entry, because the
  consensus shifted then.

When citing an exception, mark it explicitly in the research file:

```markdown
Source: <URL> (2021-09-24, stable spec — OWASP Top 10:2021)
```

## Imperative voice gate

Every rule in `best-practices.md` is imperative. The transformation:

| Soft / suggestive form         | Imperative form                            |
|--------------------------------|--------------------------------------------|
| "Consider using X for Y."      | "Use X for Y."                             |
| "Avoid Z."                     | "Do not use Z."                            |
| "It is recommended that you …" | "Use …" / "Configure …" / "Pin …"          |
| "Many teams choose …"          | (drop or convert into a "Use …" with cite) |

If a rule cannot be stated imperatively without losing its meaning, that is a
strong signal it is not yet a rule — leave it in the research file as an
"Open question" rather than promoting it.

## Push-back loop

When a research agent returns a rule cited to a non-primary or undated source:

1. Push back **once** with the specific complaint, naming the offending source
   and the gate it failed (`undated`, `non-maintainer blog`, `pre-2025
   without spec exception`).
2. Accept whatever the agent returns on the second pass — even if some rules
   were dropped. Dropping is the correct outcome when no primary source
   exists. The reference is better with 50 cited rules than 80 half-cited
   ones.
3. Track which rules survived. The verification phase (Phase 5) confirms
   coverage.

## Examples

**Pass:**
- `https://nextjs.org/docs/app/building-your-application/caching` (Next.js
  official docs, App Router, last-updated visible).
- `https://owasp.org/Top10/A01_2021-Broken_Access_Control/` (OWASP Top 10:2021).
- `https://www.rfc-editor.org/rfc/rfc9110` (HTTP Semantics, stable spec).
- `https://github.com/rust-lang/rust/releases/tag/1.84.0` (Rust release notes,
  2025-01-09).
- `https://kubernetes.io/blog/2025/04/.../` (k8s.io blog post by SIG
  maintainer, dated).

**Fail:**
- `https://medium.com/some-bootcamp/...` (no maintainer, listicle).
- `https://stackoverflow.com/questions/...` (signal, not citation).
- `https://www.geeksforgeeks.org/...` (tutorial farm).
- `https://blog.example.io/2024-best-practices` (pre-2025, not a spec).
- A URL with no visible publish or update date (`undated`).

## Where the gate is enforced

- **Phase 2 brief**: every dispatched agent is told the gate explicitly.
- **Push-back loop**: one round of correction per agent.
- **Phase 5 verification**: every research file is scanned for at least one
  primary, dated source per rule. Rules without survive only if marked
  `(opinion / convention)` in `best-practices.md`.

The gate exists to make the produced reference a load-bearing input to a
downstream audit. A weak source here becomes a wrong audit finding later.
