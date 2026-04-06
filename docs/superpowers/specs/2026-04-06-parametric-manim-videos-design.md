# Parametric Manim Videos — Design Spec

**Date:** 2026-04-06
**Purpose:** Generate individual Manim videos for every plugin, agent, skill, and hook from a single template
**Format:** MP4 videos (~10-15s each), auto-generated from flow data in data.js

---

## Data Model

Each item in `app/src/data.js` gets an optional `flow` field:

```js
{
  name: "context-mode",
  // ...existing fields...
  flow: {
    input: "Tool output (500+ lines)",
    uses: ["FTS5 indexing", "Token counting", "ctx_search API"],
    output: "Indexed & searchable knowledge base"
  }
}
```

Items without `flow` get no video. Structure is always: `input → tool → [uses] → output`.

## Manim Template

Single scene `animations/scenes/template.py` with class `ItemFlowScene`:

1. Top: Input text appears (fade in)
2. Arrow down to central box with item name (color based on category)
3. Internal "uses" boxes appear inside/below the central box (LaggedStart)
4. Arrow down to output text
5. Final label with item name

The scene reads from a JSON file passed via environment variable or CLI arg:

```bash
FLOW_DATA='{"name":"context-mode","color":"#a855f7","input":"Tool output","uses":["FTS5","Tokens","API"],"output":"Knowledge base"}' python3 -m manim -ql --format=gif scenes/template.py ItemFlowScene
```

## Color Mapping

- Plugins: purple (#a855f7)
- Agents: orange (#f97316)
- Skills: green (#22c55e)
- Hooks: cyan (#00d2ff)
- MCP Servers: magenta (#ec4899)

## Batch Generator

`animations/generate_all.py`:

1. Reads `animations/flows.json` (extracted/maintained alongside data.js)
2. For each item, sets env var and invokes manim
3. Converts GIF to MP4 with ffmpeg
4. Outputs to `app/public/videos/items/{item-id}.mp4`

## flows.json Structure

```json
[
  {
    "id": "context-mode",
    "name": "context-mode",
    "color": "#a855f7",
    "input": "Tool output (500+ lines)",
    "uses": ["FTS5 indexing", "Token counting", "ctx_search API"],
    "output": "Indexed & searchable knowledge base"
  }
]
```

## Web Integration

### General section (already done)
- "How it works" section stays at top with the 6 overview videos in tabs

### Per-item videos (new)
- In `DetailPanel.jsx`, if item has a matching video in `/videos/items/{id}.mp4`, show it
- Video: autoplay, loop, muted, playsInline
- Positioned above the description in the detail panel
- Graceful: no video file = no video element rendered

## File Structure

```
animations/
├── scenes/
│   ├── template.py          # Parametric scene (NEW)
│   ├── overview.py          # Existing
│   ├── hooks.py             # Existing
│   ├── plugins_mcp.py       # Existing
│   ├── skills.py            # Existing
│   ├── agents.py            # Existing
│   └── token_savings.py     # Existing
├── flows.json               # Flow data for all items (NEW)
├── generate_all.py          # Batch generator script (NEW)
├── common/
│   ├── styles.py
│   └── components.py
├── Makefile
└── requirements.txt

app/public/videos/
├── overview.mp4             # Existing general videos
├── hooks.mp4
├── plugins_mcp.mp4
├── skills.mp4
├── agents.mp4
├── token_savings.mp4
└── items/                   # NEW: per-item videos
    ├── context-mode.mp4
    ├── claude-mem.mp4
    ├── code-reviewer.mp4
    └── ...
```

## Scale

- ~60 items with flow data
- ~5s render per item = ~5 min total
- Adding new items: add to flows.json, run generate_all.py
