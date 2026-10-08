# HTML Report Format

The architectural review is rendered as a single self-contained HTML file in the OS temp directory. Styling comes from `$HOME/.claude/rules/html-style.md` and its reference file (`$HOME/.claude/plans/planner/_style/mega-plan-reference.html`): copy its tokens, fonts and components. **All diagrams are ASCII / box-drawing inside `<pre class="diagram">`.** No Tailwind, no Mermaid, no CDN scripts. The only external resource is Google Fonts.

## Scaffold

```html
<title>Architecture review · {{repo name}}</title>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
/>
<style>
  /* tokens, body, main, h1/h2, .eyebrow, .lede, .badge, .chip, .table-wrap: copied from the reference file */
  pre.diagram {
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.45;
    background: var(--code);
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0;
  }
  .ba {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
  }
  .ba > div {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .ba h4 {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
</style>
<main>
  <header>...</header>
  <section id="candidates">...</section>
  <section id="top-recommendation">...</section>
</main>
```

## Header

`.eyebrow` with repo name and date, `h1`, then a compact legend for the ASCII notation (see below). No introduction paragraph. Straight into the candidates.

## Candidate card

The diagrams carry the weight. Prose is sparse, plain, and uses the glossary terms (from the `/codebase-design` skill) without ceremony.

Each candidate is one `<details open>` card from the reference file:

- **Title**: short, names the deepening (e.g. "Collapse the Order intake pipeline").
- **Badge row**: recommendation strength as `.badge` (`Strong` = `low`/good, `Worth exploring` = `med`/warn, `Speculative` = `repo`/muted), plus a `.chip` for the dependency category (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files**: monospaced list.
- **Before / After diagram**: the centrepiece. Two `<pre class="diagram">` side by side inside `.ba`. See patterns below.
- **Problem**: one sentence. What hurts.
- **Solution**: one sentence. What changes.
- **Wins**: bullets, ≤6 words each. e.g. "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (if applicable): one line in a `.q.pending` box.

No paragraphs of explanation. If the diagram needs a paragraph to be understood, redraw the diagram.

## ASCII notation (put this legend in the header)

```
┌────────┐  module               ┏━━━━━━━━┓  deep module (thick border)
└────────┘                       ┗━━━━━━━━┛
──▶         call / dependency    ╌╌▶         leak across a seam (mark it "leak")
┆           seam                 (faded)     internals now hidden behind the interface
```

## Diagram patterns

Pick the pattern that fits the candidate. Keep each diagram under ~20 lines and ~60 columns so before/after sit side by side.

### Call flow (the workhorse)

```
BEFORE                                   AFTER
┌──────────────┐                         ┏━━━━━━━━━━━━━━━━━━━━━━━━┓
│ OrderHandler │                         ┃   Order intake module   ┃
└──────┬───────┘                         ┃  validate · price · save┃
       ▼                                 ┗━━━━━━━━━━━┯━━━━━━━━━━━━┛
┌──────────────┐                                     ┆ seam
│OrderValidator│                         ┌───────────┴───────────┐
└──────┬───────┘                         │ PricingClient (adapter)│
       ▼                                 └───────────────────────┘
┌──────────────┐  leak
│  OrderRepo   │╌╌╌╌╌╌▶ PricingClient
└──────────────┘
```

### Cross-section (layered shallowness)

```
BEFORE: a call crosses 5 thin layers        AFTER: 1 thick band
│ controller   │ parse                      ┃ Order intake                 ┃
│ facade       │ forward                    ┃ parse · validate · price ·   ┃
│ service      │ forward                    ┃ save (one interface, tested  ┃
│ helper       │ validate                   ┃ through it)                  ┃
│ repo wrapper │ save
```

### Mass diagram (interface as wide as implementation)

```
            interface   implementation
BEFORE      ██████████  ███████████       shallow: almost the same size
AFTER       ██          ███████████████   deep: small interface, more behind it
```

### Call-graph collapse

```
BEFORE                         AFTER
buildQuote()                   ┏━ quote(order) ━━━━━━━━━━━┓
 ├─ loadRates()                ┃  (loadRates)             ┃
 ├─ applyDiscounts()           ┃  (applyDiscounts)        ┃
 │   └─ roundMoney()           ┃  (roundMoney, formatQuote)┃
 └─ formatQuote()              ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Style guidance

- Follow html-style.md: one 880px column, `--surface` cards with a 1px `--line` border, no shadows.
- Semantic colour only through `--good`, `--warn`, `--high`; `--accent` for links and what is new.
- Box-drawing characters need a monospace font: always `var(--mono)` inside `pre.diagram`.
- Name boxes with real module names from the repo and the glossary, never placeholders.
- The report is static: no scripts.

## Top recommendation section

One larger card. Candidate name, one sentence on why, anchor link to its card. That's it.

## Tone

Plain English, concise, but the architectural nouns and verbs come straight from the `/codebase-design` skill. Concision is not an excuse to drift.

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit (for module) · API, signature (for interface) · boundary (for seam) · layer, wrapper (for module, when you mean module).

**Phrasings that fit the style:**

- "Order intake module is shallow: interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** name the gain in glossary terms: _"locality: bugs concentrate in one module"_, _"leverage: one interface, N call sites"_, _"interface shrinks; implementation absorbs the wrappers"_. Don't write _"easier to maintain"_ or _"cleaner code"_, because those terms aren't in the glossary and don't earn their place.

No hedging, no throat-clearing, no "it's worth noting that…". If a sentence could be a bullet, make it a bullet. If a bullet could be cut, cut it. If a term isn't in the `/codebase-design` glossary, reach for one that is before inventing a new one.
